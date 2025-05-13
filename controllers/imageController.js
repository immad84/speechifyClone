
// Upload profile Image

exports.uploadImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          data: {},
          isSuccess: false,
          statusCode: 400,
          message: 'No image uploaded',
          developerError: 'File not found in request',
        });
      }
  
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
      // Optional: Save imageUrl to user in DB if needed
  
      return res.status(200).json({
        data: { imageUrl },
        isSuccess: true,
        statusCode: 200,
        message: 'Action perform successfully',
        developerError: '',
      });
    } catch (error) {
      return res.status(500).json({
        data: {},
        isSuccess: false,
        statusCode: 500,
        message: 'Something went wrong',
        developerError: error.message,
      });
    }
  };
  