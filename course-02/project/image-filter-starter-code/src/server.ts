import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, isValidUrl, deleteTmpFiles } from './util/util';

(async () => {

  const app = express();
  const port = process.env.PORT || 8082;
  app.use(bodyParser.json());


  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredimage", async ( req, res ) => {

    const { image_url } = req.query;

    if(!isValidUrl(image_url)){
      return res.status(400).send({ message: 'Invalid request: image_url is not valid' });
    }

    const image_path = await filterImageFromURL(image_url);

    if(!image_path){
      return res.status(500).send({ message: 'Image could not be filtered'});
    }

    res.status(200).sendFile(image_path);
    deleteTmpFiles();
  });
  

  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
  
})();