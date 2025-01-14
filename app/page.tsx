'use client'

import { IProduct } from "@/models/Product";
import { useEffect, useState } from "react";

export default function Home(){
  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(()=>{
    const fetchProducts = async()=>{
      try {
        const data = await fetch("/api/products");
        
      } catch (error) {
        
      }
    }
  })
}