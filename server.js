const express = require('express')
const path = require('path')
var url = require('url')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.sendFile(path.join(__dirname+'/public/getInput.html')))
  .get('/submit', (req, res) => calculateRate(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function calculateRate(req, res){
	var reqURL = url.parse(req.url, true);
	var weight = Number(reqURL.query.weight);
	var type = reqURL.query.type.toString();
	var rate = 0;
	var longType = "";

	if(type == "stampedLetter"){
		longType = "Letters (Stamped)";
		if(weight <= 1){
			rate = 0.50;
		}
		else if(weight <= 2){
			rate = 0.71;
		}
		else if(weight <= 3){
			rate = 0.92;
		}
		else{
			rate = 1.13;
		}
	}
	else if(type == "meteredLetter"){
		longType = "Letters (Metered)";
		if(weight <= 1){
			rate = 0.47;
		}
		else if(weight <= 2){
			rate = 0.68;
		}
		else if(weight <= 3){
			rate = 0.89;
		}
		else{
			rate = 1.10;
		}
	}
	else if(type == "largeEnvelope"){
		longType = "Large Envelopes (Flats)";
		var roundedWeight;

		if(weight > 13){
			roundedWeight = 12;
		}
		else if((weight % 1) == 0){
			roundedWeight = weight - 1;
		}
		else{
			roundedWeight = weight - (weight % 1);
		}

		rate = 1 + (roundedWeight * .21);
	}
	else if(type == "package"){
		longType = "First-Class Package Service - Retail";
		if(weight <= 4){
			rate = 3.50;
		}
		else if(weight <= 8){
			rate = 3.75;
		}
		else if(weight <= 9){
			rate = 4.10;
		}
		else if(weight <= 10){
			rate = 4.45;
		}
		else if(weight <= 11){
			rate = 4.80;
		}
		else if(weight <= 12){
			rate = 5.15;
		}
		else{
			rate = 5.50;
		}
	}
	
	rate = rate.toFixed(2);

	res.render('pages/getRate', {
		weight: weight,
		type: longType,
		rate: rate
	})
}