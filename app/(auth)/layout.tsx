export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-5 shadow-inner">
            <span className="text-2xl font-bold text-accent">DH</span>
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Digital Heros</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
