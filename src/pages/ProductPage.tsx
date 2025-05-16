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

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }

    setCep(value);

    if (addressInfo) {
      setAddressInfo(null);
      setCepError("");
    }
  };

  const searchCep = async () => {
    const cleanCep = cep.replace("-", "");

    if (cleanCep.length !== 8) {
      setCepError("CEP inválido. Digite um CEP com 8 dígitos.");
      setAddressInfo(null);
      return;
    }

    setIsLoadingCep(true);
    setCepError("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        setAddressInfo(null);
      } else {
        setAddressInfo(data);
      }
    } catch (error) {
      setCepError("Erro ao buscar o CEP. Tente novamente.");
      setAddressInfo(null);
      console.error("Erro ao buscar o CEP:", error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={productData.images[mainImage]}
              alt={`${productData.name} - Imagem ${mainImage + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {productData.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(index)}
                className={`rounded-md overflow-hidden border-2 flex-shrink-0 ${
                  mainImage === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-16 h-16 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {productData.name}
          </h1>
          <p className="text-2xl font-semibold text-blue-600 mb-4">
            {productData.price}
          </p>

          <p className="text-gray-600 mb-6">{productData.description}</p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Tamanho</h2>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-10 w-10 flex items-center justify-center rounded border ${
                    selectedSize === size
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Cor</h2>
            <div className="flex flex-wrap gap-3">
              {productData.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-8 w-8 rounded-full ${color.code} ${
                    selectedColor === color.name
                      ? "ring-2 ring-offset-2 ring-blue-500"
                      : ""
                  }`}
                  title={color.name}
                  aria-label={`Cor ${color.name}`}
                />
              ))}
            </div>
            {selectedColor && (
              <p className="text-sm text-gray-600 mt-2">
                Cor selecionada: {selectedColor}
              </p>
            )}
          </div>

          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-3">
              Calcular frete e prazo de entrega
            </h2>

            <div className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={cep}
                  onChange={handleCepChange}
                  placeholder="Digite seu CEP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                  maxLength={9}
                />
              </div>

              <button
                onClick={searchCep}
                disabled={isLoadingCep}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoadingCep ? "Buscando..." : "Calcular"}
              </button>
            </div>

            {cepError && (
              <p className="text-red-500 text-sm mt-2">{cepError}</p>
            )}

            {addressInfo && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">Endereço de entrega:</p>
                <p>
                  {addressInfo.logradouro}, {addressInfo.bairro}
                </p>
                <p>
                  {addressInfo.localidade} - {addressInfo.uf}, CEP:{" "}
                  {addressInfo.cep}
                </p>
                <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
                  <div>
                    <p className="text-sm font-medium">Prazo de entrega:</p>
                    <p className="text-green-600">3-5 dias úteis</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Valor do frete:</p>
                    <p className="text-green-600 font-semibold">R$ 12,90</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition">
              Comprar agora
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
