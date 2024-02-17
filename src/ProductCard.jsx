import React from "react";

const ProductCard = React.forwardRef(({ product }, ref) => {
  const productContent = (
    <>
      <h2>{product.name}</h2>
    </>
  );
  const content = ref ? (
    <article className="article" ref={ref}>
      {productContent}
    </article>
  ) : (
    <article className="article">{productContent}</article>
  );
  return content;
});

export default ProductCard;
