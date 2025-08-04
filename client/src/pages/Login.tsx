// client/src/pages/Login.tsx
import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn 
        path="/login" 
        routing="path" 
        signUpUrl="/signup" 
        afterSignInUrl="/"
      />
    </div>
  );
}