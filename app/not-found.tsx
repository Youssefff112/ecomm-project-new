import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import errorSvg from '../assets/images/error.svg';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src={errorSvg}
            alt="404 Error"
            width={536}
            height={333}
            priority
            className="w-full max-w-md h-auto"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        
        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
