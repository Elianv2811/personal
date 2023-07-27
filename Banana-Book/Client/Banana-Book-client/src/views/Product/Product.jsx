import React from 'react';
import './Product.css';
import ProductForm from './Components/ProductForm';
import { useParams } from 'react-router-dom';

const Product = () => {
  const { id } = useParams();
  console.log(id);

  return (
    <section className="product">
      <ProductForm />
    </section>
  );
};

export default Product;
