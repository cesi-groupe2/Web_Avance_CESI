#!/bin/bash

set -e  # Arrêter l'exécution en cas d'erreur

# Vérifier si l'utilisateur est root
if [[ $EUID -ne 0 ]]; then
   echo "Ce script doit être exécuté avec sudo ou en root." 
   exit 1
fi

echo "🚀 Installation de Go 1.24.1..."
GO_VERSION="1.24.1"
GO_TARBALL="go$GO_VERSION.linux-amd64.tar.gz"
GO_URL="https://go.dev/dl/$GO_TARBALL"

# Supprimer une ancienne installation de Go
rm -rf /usr/local/go
wget -q $GO_URL
tar -C /usr/local -xzf $GO_TARBALL
rm -f $GO_TARBALL

# Configurer Go dans le PATH
echo "export PATH=/usr/local/go/bin:\$PATH" >> ~/.bashrc
source ~/.bashrc

echo "✅ Go installé : $(go version)"

# Installer NVM (Node Version Manager)
echo "🚀 Installation de Node.js 22.14.0 avec NPM 10.9.2..."
if [ ! -d "$HOME/.nvm" ]; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Installer Node.js et NPM
nvm install 22.14.0
nvm use 22.14.0
nvm alias default 22.14.0

echo "✅ Node.js installé : $(node -v)"
echo "✅ NPM installé : $(npm -v)"

# Installer Swag (Swagger)
echo "🚀 Installation de Swag (v1.16.4)..."
go install github.com/swaggo/swag/cmd/swag@v1.16.4

# Ajouter Swag au PATH
echo "export PATH=\$HOME/go/bin:\$PATH" >> ~/.bashrc
source ~/.bashrc

echo "✅ Swag installé : $(swag -version)"

echo "🎉 Installation terminée !"
