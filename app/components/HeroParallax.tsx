"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { title } from "process";

export function HeroParallaxD() {
  return <HeroParallax products={products} />;
}
export const products = [
    {
      title: "Product 1",
      link: "#",
      thumbnail: "https://ik.imagekit.io/ocnsmwz76/hero1?updatedAt=1738254180929",
    },
    {
      title: "Product 2",
      link: "#",
      thumbnail: "https://ik.imagekit.io/ocnsmwz76/hero2?updatedAt=1738254199604",
    },
    {
      title: "Product 3",
      link: "#",
      thumbnail: "https://ik.imagekit.io/ocnsmwz76/hero3?updatedAt=1738255038673",
    },
    {
      title: "Product 4",
      link: "#",
      thumbnail: "https://ik.imagekit.io/ocnsmwz76/hero4?updatedAt=1738255057029",
    },
    {
        title: "Product 5",
        link: "#",
        thumbnail: "https://ik.imagekit.io/ocnsmwz76/hero5?updatedAt=1738255076660",
    }
  ];
