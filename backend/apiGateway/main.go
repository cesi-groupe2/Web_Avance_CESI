package main

import (
	"io"
	"log"
	"net/http"
	"time"
)

// @title           Swagger Easeat API
// @version         2.0
// @description     This is the API for application Easeat. It's for commande food in the restaurant.

// @contact.name   Groupe 2 FISA INFO A4 CESI (2025)
// @contact.url    https://contact.easeat.fr
// @contact.email  benjamin.guerre@viacesi.fr

// @host      localhost:8080
// @BasePath  /api

// @securityDefinitions.basic  BasicAuth

// Middleware CORS
func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "86400") // 24 heures

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

// Handler de proxy avec logs
func handleProxy(target string) http.HandlerFunc {
	return withCORS(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		log.Printf("[REQ] %s %s depuis %s", r.Method, r.URL.Path, r.RemoteAddr)

		// log Authorization header
		authHeader := r.Header.Get("Authorization")
		log.Printf("[AUTH] %s", authHeader)

		// Construction de la requête proxy
		proxyURL := target + r.URL.Path
		req, err := http.NewRequest(r.Method, proxyURL, r.Body)
		if err != nil {
			log.Printf("[ERREUR] Création de la requête échouée : %v", err)
			http.Error(w, "Erreur création requête", http.StatusInternalServerError)
			return
		}

		// Transfert de tous les en-têtes, y compris le header d'authentification
		req.Header = r.Header.Clone()

		log.Printf("[PROXY] Redirection vers %s", proxyURL)

		// Création d'un client HTTP
		client := &http.Client{}

		resp, err := client.Do(req)
		if err != nil {
			log.Printf("[ERREUR] Erreur de communication avec le microservice %s : %v", proxyURL, err)
			http.Error(w, "Erreur communication microservice", http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		// Copie des en-têtes de la réponse du microservice vers la réponse finale
		for key, values := range resp.Header {
			// Ne pas copier les en-têtes CORS du microservice
			if key == "Access-Control-Allow-Origin" || 
			   key == "Access-Control-Allow-Methods" || 
			   key == "Access-Control-Allow-Headers" || 
			   key == "Access-Control-Allow-Credentials" || 
			   key == "Access-Control-Max-Age" {
				continue
			}
			// Supprimer l'en-tête existant avant d'ajouter les nouvelles valeurs
			w.Header().Del(key)
			for _, value := range values {
				w.Header().Add(key, value)
			}
		}

		// Réponse finale
		w.WriteHeader(resp.StatusCode)
		io.Copy(w, resp.Body)

		duration := time.Since(start)
		log.Printf("[OK] %s %s -> %d (%s)", r.Method, r.URL.Path, resp.StatusCode, duration)
	})
}

func main() {
	// Configuration des routes
	http.HandleFunc("/auth/", handleProxy("http://localhost:8001"))
	http.HandleFunc("/public/", handleProxy("http://localhost:8001"))
	http.HandleFunc("/restaurant/", handleProxy("http://localhost:8004"))
	http.HandleFunc("/payment/", handleProxy("http://localhost:8006"))
	http.HandleFunc("/order/", handleProxy("http://localhost:8002"))

	// Ajout d'un handler pour la racine qui gère les requêtes OPTIONS
	http.HandleFunc("/", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		http.NotFound(w, r)
	}))

	log.Println("🚀 API Gateway Easeat en écoute sur :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
