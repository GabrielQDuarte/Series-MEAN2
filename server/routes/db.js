var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    console.log('Conectado ao MongoDB.');
    var Favorite = mongoose.model('Favorite', {
        nome: "string",
        sinopse: "string",
        bannerUrl: "string",
        idApi: "number"
    });

    /* GET All Favorites */
    router.get('/favorites', function(req, res) {

        Favorite.find(function(err, favorites) {

            if (err) {
                var retornoJson = {
                    sucesso: false,
                    mensagem: err
                };
                res.json(retornoJson);
            } else {
                res.json(favorites);
            }
        });
    });

    /* GET One Favorite with the provided ID */
    router.get('/favorite/:id', function(req, res) {
        Favorite.findOne({
            _id: req.params.id
        }, function(err, favorite) {
            if (err) {
                var retornoJson = {
                    sucesso: false,
                    mensagem: err
                };
                res.json(retornoJson);
            } else {
                res.json(favorite);
            }
        });
    });

    /* GET One Favorite with the provided IDApi */
    router.get('/favorite/idApi/:id', function(req, res) {
        Favorite.findOne({
            idApi: req.params.id
        }, function(err, favorite) {
            if (err) {
                var retornoJson = {
                    sucesso: false,
                    mensagem: err
                };
                res.json(retornoJson);
            } else {
                res.json(favorite);
            }
        });
    });

    /* POST/SAVE a Favorite */
    router.post('/favorite', function(req, res) {
        var favoriteBody = req.body;

        var favorite = new Favorite({
            nome: favoriteBody.nome,
            sinopse: favoriteBody.sinopse,
            bannerUrl: favoriteBody.bannerUrl,
            idApi: favoriteBody.idApi
        });

        Favorite.findOne({
            idApi: favorite.idApi
        }, function(err, favoriteFound) {
            var retornoJson;
            if (err) {
                retornoJson = {
                    sucesso: false,
                    mensagem: err
                };
                res.json(retornoJson);
            } else {
                if (!favoriteFound) {
                    favorite.save(function(err, favorite) {
                        var retornoJson;
                        if (err) {
                            retornoJson = {
                                sucesso: false,
                                mensagem: err
                            };
                            res.json(retornoJson);
                        } else {
                            retornoJson = {
                                sucesso: true,
                                mensagem: "POST/SAVE: Favorito '" + favorite.nome + "' salvo com sucesso."
                            };
                            res.json(retornoJson);
                        }
                    });
                } else {
                    retornoJson = {
                        sucesso: false,
                        mensagem: "POST/SAVE: Favorito '" + favorite.nome + "' já existente."
                    };
                    res.json(retornoJson);
                }
            }
        });


    });

    /* PUT/UPDATE a Favorite */
    router.put('/favorite/:id', function(req, res) {
        var favorite = req.body;

        Favorite.update({
            _id: req.params.id
        }, {
            $set: {
                nome: favorite.nome,
                sinopse: favorite.sinopse,
                bannerUrl: favorite.bannerUrl,
                idApi: favorite.idApi
            }
        }, (err) => {
            var retornoJson;
            if (err) {
                retornoJson = {
                    sucesso: false,
                    mensagem: err
                };
                res.json(retornoJson);
            } else {
                retornoJson = {
                    sucesso: true,
                    mensagem: "PUT/UPDATE: Favorito '" + favorite.nome + "' atualizado com sucesso."
                };
                res.json(retornoJson);
            }
        });
    });

    /* DELETE a Favorite */
    router.delete('/favorite/:id', function(req, res) {

        Favorite.findOne({
                idApi: req.params.id
            },
            (err, favoriteFound) => {
                var retornoJson;
                if (err) {
                    retornoJson = {
                        sucesso: false,
                        mensagem: err
                    };
                    res.json(retornoJson);
                } else {
                    if (favoriteFound) {
                        Favorite.remove({
                                _id: favoriteFound._id
                            },
                            (err) => {
                                var retornoJson;
                                if (err) {
                                    retornoJson = {
                                        sucesso: false,
                                        mensagem: err
                                    };
                                    res.json(retornoJson);
                                } else {
                                    retornoJson = {
                                        sucesso: true,
                                        mensagem: "DELETE: Favorito '" + favoriteFound.nome + "' removido com sucesso."
                                    };
                                    res.json(retornoJson);
                                }
                            });
                    } else {
                        retornoJson = {
                            sucesso: false,
                            mensagem: "DELETE: Favorito " + req.params.id + " não existente."
                        };
                        res.json(retornoJson);
                    }
                }
            });
    });
});

mongoose.connect('mongodb://dbseries-mean:dbseries-mean@ds111188.mlab.com:11188/series-mean2');

module.exports = router;
