// backend/middleware/validate.js

export const validate = (schema) => {
  return (req, res, next) => {
    // req.body ko schema ke saath validate karo
    const { error } = schema.validate(req.body);
    
    if (error) {
      // Agar error hai, toh 400 Bad Request bhejo
      return res.status(400).json({ 
        success: false, 
        message: "Validation Error: " + error.details[0].message 
      });
    }
    
    // Agar sab sahi hai, toh agle controller pe jao
    next();
  };
};