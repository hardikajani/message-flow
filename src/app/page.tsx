"use client"


import messages from '@/messages.json'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import { Footer } from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
    <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16 bg-[#1f2a38] text-slate-200">
        <section className='text-center mb-8 md:mb-12'>
          <h1 className='text-2xl md:text-3xl font-bold'>Dive into the world of Anonymous Conversations</h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>Join our community of anonymous users and explore the power of open communication.</p>
          <Link href='/dashboard'>
            <Button className='mt-4 md:mt-6'>Get Started</Button>
          </Link>
        </section>
        <Carousel
          opts={{
            align: "start",
          }}
          orientation="vertical"
          className="w-full max-w-lg mt-2"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent className="-mt-1 h-[160px]">
            {messages.map((message, index) => (
              <CarouselItem key={index} className="pt-1 md:basis-1/2">
                <div className="p-1">

                  <Card className='flex flex-col items-center justify-center bg-slate-200'>
                    <CardHeader className='text-lg font-semibold'>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                      <span className="text-base">{message.content}</span>
                      <span className='text-sm'>{message.received}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
      <CarouselNext /> */}
        </Carousel>
      </main>
      <Footer />
    </>
  );
}
