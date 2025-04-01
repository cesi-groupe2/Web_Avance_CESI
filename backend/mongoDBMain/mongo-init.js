db = db.getSiblingDB("easeat");

db.createUser({
  user: "easeat",
  pwd: "easeat",
  roles: [
    {
      role: "readWrite",
      db: "easeat",
    },
  ],
});
