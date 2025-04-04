import React from 'react';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import MobileNavbar from '../../components/MobileNavbar/MobileNavbar';

const AddProductPageMobile = () => {
  return (
    <MobileLayout>
      <AddProductForm />
      <MobileNavbar />
    </MobileLayout>
  );
};

export default AddProductPageMobile;
