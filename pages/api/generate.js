import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const diagnostico = req.body.diagnostico || '';
  if (diagnostico.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid diagnostico",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(diagnostico),
      temperature: 0.73,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
// La función generatePrompt crea una cadena de texto con diferentes posibles enfermedades y sus síntomas, y el diagnóstico ingresado por el usuario. 
// La cadena de texto se utiliza como prompt para generar la respuesta de OpenAI.
function generatePrompt(diagnostico) {
  return `Indica una posible enfermedad con los sintomas indicados por el usuario.

  Posible enfermedad: Gripe
  Síntomas: Fiebre, escalofríos, dolores musculares, fatiga, dolor de cabeza, congestión nasal y dolor de garganta. 
  Posible enfermedad: Resfriado común
  Síntomas: Congestión nasal, secreción nasal, estornudos, dolor de garganta, tos y malestar general. 
  Posible enfermedad: Alergia
  Síntomas: Congestión nasal, secreción nasal, estornudos, picazón en los ojos y la nariz, ojos llorosos, tos y dificultad para respirar.
  Posible enfermedad: Infección del tracto urinario
  Síntomas: Dolor o ardor al orinar, necesidad frecuente y urgente de orinar, orina turbia o con sangre, dolor en la parte baja del abdomen o en la espalda.
diagnostico: ${diagnostico} que el diagnostico sea menos de 10 palabras y solamente el nombre de la enfermedad
nombre enfermedad:`;
}
