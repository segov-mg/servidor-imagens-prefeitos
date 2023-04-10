const Cores = require('../models/cores');
const { getMaxOcurrence, shuffleArray } = require('../functionsNeeded')

exports.showIndex = (req, res, next) => {
    res.send('rodando Cores API');
}


exports.verCoresPorCategoria = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const pesquisado = req.query.page || req.query.limit;
    const categoria = req.params.categoria;

    if (!categoria) {
        res.status(400).json({ error: "Categoria é obrigatório." });
        res.end();
        return;
    };

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    Cores.get(async (err, esquema) => {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
            res.end();
            return;
        }
        const resultUsers = esquema.slice(startIndex, endIndex);
        let data = pesquisado ? resultUsers : esquema;
        
        const filterCategoria = () => {
            let encontrado = data.filter(filme => filme.categoria === categoria);
            return encontrado;
        }
    
        data = filterCategoria();
        data = shuffleArray(data);
        
 
        res.json({
            status: "success",
            message: "Esquemas de cores para serem exibidos",
            data,
            contagem: esquema.length
        });
    });
};

exports.criarEsquema = async (req, res, next) => {
      const esquema = new Cores({
            colorSchema: req.body.colorSchema,
            colors: req.body.colors,
            categoria: req.body.categoria,
            rating: 0,
      });
      esquema.save(function (err) {
          if (err) {
              res.status(500).json({ error: err.message });
              res.end();
              return;
          };
          res.json(esquema);
          res.end();
      })
}

exports.verEsquemaEspecifico = function (req, res) {
    Cores.find({"colorSchema": req.params.colorSchema}, function (err, esquema) {
        if (err) {
            res.send(err);
            res.end();
            return;
        }
        res.json({
            message: 'Carregando detalhes do esquema de cores',
            data: esquema
        });
    });
};


exports.darNotaParaEsquema = function (req, res) {
  

   Cores.findOne({"colorSchema": req.params.colorSchema}).then(esquema => {
       let bestVariation = esquema.bestVariation;
       let bestVariationInput = req.body.bestVariation;
       let bestVariationResult = esquema.bestVariationResult;
       let rating = esquema.rating;
       let soma;
       try {
       bestVariation.push(bestVariationInput);
       } catch(err) {
           console.log("erro ao adicionar ao array BestVariation", err)
       }
       

       bestVariationResult = bestVariation.length === 1 ? bestVariationInput : getMaxOcurrence(bestVariation);
       
       if (rating === 0) {
            rating = req.body.rating;
                } else {
                     soma = rating + req.body.rating;
                     rating = soma / 2; 
                }
      esquema.bestVariation = bestVariation;
      esquema.bestVariationResult = bestVariationResult;
      esquema.rating = rating;

      esquema.markModified('bestVariation');
      esquema.markModified('bestVariationResult');
      esquema.markModified('rating');

      try {
      esquema.save()
      } catch(err) {
          console.log("Erro ao salvar: ", err)
      }
      res.end();


   }).catch(err => console.log("erro na requisição", err));


};

exports.deletarEsquema = function (req, res) {
    Cores.remove({
        "colorSchema": req.params.colorSchema
    }, function (err, esquema) {
        if (err) {
            res.send(err);
            res.end();
            return;
        }
res.json({
            status: "sucesso",
            message: 'Filme deletado.'
        });
    });
};

exports.deletarBanco = function (req, res) {
    Cores.deleteMany({ },
        function (err) {
            if (err) {
                res.status(500).json({ error: err })
                res.end();
                return;
            }
            res.json({message: "Dados deletados com sucesso."});
            res.end();
        });
};



