const mongoose = require('mongoose');

// Připojovací řetězec MongoDB - použijeme stejný jako v aplikaci
const dbUri = 'mongodb+srv://pavlasplichal:novy22projekt@cluster0.dplz2.mongodb.net/malina?retryWrites=true&w=majority';

// Schéma pro limity - musí odpovídat schématu v aplikaci
const thresholdSchema = new mongoose.Schema({
  greenhouseId: { type: Number, required: true, unique: true },
  temperature: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  soilMoisture: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  airHumidity: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  light: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  }
});

const Threshold = mongoose.model('Threshold', thresholdSchema, 'thresholds');

// Připojení k MongoDB a čtení dat
mongoose.connect(dbUri)
  .then(async () => {
    console.log('MongoDB připojeno úspěšně');

    try {
      // Načtení všech limitů
      const thresholds = await Threshold.find({});
      
      if (thresholds.length === 0) {
        console.log('V databázi nejsou uloženy žádné limity.');
      } else {
        console.log('\nAktuální limity v databázi:');
        thresholds.forEach(threshold => {
          console.log(`\nSkleník ${threshold.greenhouseId}:`);
          console.log('Teplota:', threshold.temperature);
          console.log('Vlhkost půdy:', threshold.soilMoisture);
          console.log('Vlhkost vzduchu:', threshold.airHumidity);
          console.log('Světlo:', threshold.light);
        });
      }
    } catch (error) {
      console.error('Chyba při čtení limitů:', error);
    } finally {
      // Odpojení od MongoDB
      await mongoose.disconnect();
      console.log('\nOdpojeno od MongoDB');
    }
  })
  .catch(err => {
    console.error('Chyba při připojování k MongoDB:', err);
  }); 