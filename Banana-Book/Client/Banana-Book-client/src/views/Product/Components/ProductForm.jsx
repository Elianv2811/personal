import React from 'react';
import './ProductForm.css';
import profileIcon from '../../../assets/img/profileIcon.png';

import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import instance from '../../../api/instance';

const fetchProduct = async (id) => {
  const { data } = await instance.get(`/post/${id}`);
  return data;
};

const ProductForm = () => {
  const { id } = useParams();

  const { data } = useQuery(['product', id], () => fetchProduct(id), {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
  console.log(data);

  return (
    <div className="Product_view">
      <div className="Product">
        <h1>{data?.title}</h1>
        <div className='postImage'>
          <img src={data?.image} alt="postImage" />
          </div>
      </div>
      <div className="Product_info">
        <div className="top_product">
          <div className="price_indicator">
            <div className="price_word">
              <h1>Precio</h1>
            </div>
            <div className="price_show">
              <label className="price"> ${data?.price}</label>
            </div>
          </div>
          <div className="button_comprar">
            <button className="comprar">Comprar</button>
          </div>
        </div>
        <div className="product_description">
          <h1 className="description_word">Descripción</h1>
          <div className="description_box">
            <label className="description_product">{data?.description}</label>
          </div>
        </div>
        <div className="subject_condition">
          <h1 className="subject_word">Asignatura</h1>
          <label className="subject">{data?.category}</label>
          <h1 className="condition_word">Condición</h1>
          <label className="condition">{data?.condition}</label>
        </div>
        <div className="seller_info">
          <h1 className="seller_word">Vendedor</h1>
          <div className="seller_box">
            <img className="profile_icon" src={profileIcon} alt="profileIcon" />
            <label className="seller">{`${data?.user?.name} ${data?.user?.lastName}`}</label>
          </div>
        </div>
        <div className="contact_seller">
          <button className="contact">Contactar al vendedor</button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
