// ProductList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
const label = { inputProps: { "aria-label": "Switch demo" } };
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ProductCard from "./ProductCard.jsx";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const ProductList = () => {
  const [isFreeDeliveryEnabled, setIsFreeDeliveryEnabled] = useState(false);
  const [isBestSellerEnabled, setIsBestSellerEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { ref, inView } = useInView();
  const SIZE = 48;
  const LIMIT = 6366;
  //new
  const getAllProduct = async (FROM) => {
    const response = await fetch(
      `https://search.basalam.com/ai-engine/api/v2.0/product/search?from=${FROM}&filters.slug=handmade-leather-accessory&dynamicFacets=true&size=${SIZE}&adsImpressionDisable=false`
    );
    return await response.json();
  };
  //new
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    isSuccess,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: "key",
    queryFn: ({ pageParam }) => getAllProduct(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // pageParam += 48
      return lastPage.products?.length === LIMIT
        ? undefined
        : allPages.length + 48;
    },
  });
  console.log("data", data);

  //new
  const content =
    isSuccess &&
    data.pages.map((page, j) =>
      page.products.map((product, i) => {
        console.log(data.pages.length, page.products.length, i, j);
        if (data.pages.length * page.products.length === (i + 1) * (1 + j)) {
          // return <div ref={ref}>{product.name}</div>;
          return <ProductCard ref={ref} product={product}/>
        }
        return <ProductCard product={product}/>;
      })
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2 sticky top-0 bg-white">
        <div className="flex  gap-2 border items-center w-[10rem]">
          <Switch
            {...label}
            onChange={() => {
              return setIsFreeDeliveryEnabled(!isFreeDeliveryEnabled);
            }}
          />
          ارسال رایگان
        </div>
        <div className="flex  gap-2 border items-center w-[10rem]">
          <Switch
            {...label}
            onChange={() => {
              return setIsBestSellerEnabled(!isBestSellerEnabled);
            }}
          />
          غرفه برتر
        </div>
      </div>

      {/* {filteredProducts?.products?.map((product) => (
        <ProductCard product={product} key={product.id}/>
      ))}  */}
      {content}
      {isFetchingNextPage && <h3>Loading...</h3>}
    </div>
  );
};

export default ProductList;
