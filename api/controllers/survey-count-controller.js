import { prisma } from '../utils/prisma.js'

export const getPurchaseDetails = async (req, res) => {
    console.log(req.params,'paraaaaaaaaaams');
    const { sessionId } = req.params;
    try{
      const purchaseDetails = await prisma.responsePurchase.findFirst({
        where: {
          sessionIdUrl: sessionId
        },include: {
          user: true,  // Include related user data
        },
      });
      res.status(200).json({data:purchaseDetails});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
    finally{
    }
};