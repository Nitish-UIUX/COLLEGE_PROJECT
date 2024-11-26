// routes.js
import express from 'express';
const router = express.Router();
import Users from './APIs/UsersApi.js';
import Hospitals from './APIs/HospitalsApi.js';
import Assigned from './APIs/AssignedApi.js';
import Faq from './APIs/FaqApi.js';
import Product from './APIs/ProductApi.js';
import ProductOrder from './APIs/ProductOrderApi.js';
import Doctors from './APIs/DoctorsApi.js';
// Define your routes
router.use('/api/auth', Users);
router.use('/api', Hospitals , Assigned , Faq , Product, ProductOrder , Doctors);
// router.use('/api' , Assigned);
// router.use('/api' , Faq);
// router.use('/api' , Product);

export default router;
