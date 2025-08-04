// client/src/pages/Signup.tsx
import { SignUp } from '@clerk/clerk-react';

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp 
        path="/signup" 
        routing="path" 
        signInUrl="/login" 
        afterSignUpUrl="/"
      />
    </div>
  );
}