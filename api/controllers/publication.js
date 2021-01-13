'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res) {
	res.status(200).send({message: "hola mundo desde las publicaciones"});
}


function savePublication(req, res){
	var params = req.body;


    if(!params.text) return res.status(200).send({message: 'Debes enviar un texto'});

	var publication = new Publication();
	

	publication.text = params.text;
	publication.file = 'null';
	publication.user = req.user.sub;
	publication.create_at = moment().unix();

	publication.save ((err, publicationStored) => {
		if(err) return res.status(500).send({message: 'Error al guardar las publicaciones'});

		if(!publicationStored) return res.status(404).send({message: 'La publicacion no ha sido guardada'});

		return res.status(200).send({publication: publicationStored});

		
	});       

}

function getPublications (req, res) {
	var page = 1;
	if(req.params.page){
		page= req.params.page;
	}

	var itemsPerPage = 4;

	Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
		if(err) return res.status(500).send({message: 'Error al devolder el seguimiento'});

		var follows_clean = [];

		follows.forEach((follow) => {
			follows_clean.push(follow.followed);
		});

		Publication.find({user:{"$in": follows_clean}}).sort('create_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
			
			if(err) return res.status(500).send({message: 'Error al devolder publicacion'});

			if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

			return res.status(200).send({
				total_items: total,
				page: Math.ceil(total/itemsPerPage),
				page: page,
				publications
			});
		 });
	});
}


 function getPublication(req, res) {
 	var publicationId = req.params.id;

 	Publication.findById(publicationId, (err, publication) => {
 		if(err) return res.status(500).send({message: 'Error al devolder el seguimiento'});

 		if(!publication) return res.status(404).send({message: 'No existe publication'});

 		res.status(200).send({publication});
 	});
 }

function detelePublication(req, res){
	var publicationId = req.params.id;

	Publication.find({'user': req.user.sub, '_id': publicationId}).remove((err, publicationRemoved) => {

		if(err) return res.status(500).send({message: 'Error al borrrar publicaciones'});

 		if(!publicationRemoved) return res.status(404).send({message: 'No se ha borrado la publicacion'});

 		return res.status(200).send({message: 'Publicacion eliminada'});
	});
}

// Subir archivos de imagen/Avatar de usuario

function uploadimage(req, res){
 var publicationId = req.params.id;

 
 if(req.files){

 	var file_path = req.files.image.path;
 	console.log(file_path);

	var file_split = file_path.split('\\');
	console.log(file_split);

	var file_name = file_split[2];
	console.log(file_name);

	var ext_split = file_name.split('\.');
	console.log(ext_split);
	var file_ext = ext_split[1];
	console.log(file_ext);

	if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
		   
 			Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err, publication) => {

 			 if(publication){
 			  // Actualizar documento de la publicacion
		    Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) => {
		    if(err) return res.status(500).send({message: 'Error en la peticion'});

			if(!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

			return res.status(200).send({publication: publicationUpdated});
		});	
		}else{
		 return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicacion');
		}
		});
		  


 }else{
	
    return removeFilesOfUploads(res, file_path, 'Extencion no valida');
 }


  }else{
 	 return res.status(200).send({message: 'No se han subido imagenes'});
  }

}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});

}

function getImageFile (req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/publications/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen ...'});

		}
	});
}

module.exports = {
	probando,
	savePublication,
	getPublications,
	getPublication,
	detelePublication,
	uploadimage,
	getImageFile
}