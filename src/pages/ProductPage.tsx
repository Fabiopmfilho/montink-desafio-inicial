import { useState } from "react";
import { productData } from "../product";

const ProductPage = () => {
  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cep, setCep] = useState("");
  const [addressInfo, setAddressInfo] = useState(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  return <div></div>;
};

export default ProductPage;
