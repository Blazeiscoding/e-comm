
"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "./components/ImageGallery";
import { IProduct } from "@/models/Product";
import { apiClient } from "@/lib/api-client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";


export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <ContainerScroll
        titleComponent={<>
          <h1 className="text-4xl font-semibold text-white dark:text-white">
            Dive Into the World of <br />
            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
              Beautiful Images
            </span>
          </h1>
        </>}
      >
        <Image
          src={`https://ik.imagekit.io/ocnsmwz76/IMG_20230105_140718.jpg?updatedAt=1737559253121`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false} />
      </ContainerScroll>
   <h1 className="text-3xl font-bold mb-8">Gallery Media Shop</h1><ImageGallery products={products} /> </main>
    
  );
}