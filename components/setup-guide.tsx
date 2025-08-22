import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Key, Settings, Zap } from "lucide-react"

export function SetupGuide() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Panduan Setup DeepSeek R1 Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Daftar di OpenRouter (Gratis)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Kunjungi OpenRouter.ai dan buat akun gratis untuk mendapatkan akses ke DeepSeek R1
                </p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                  <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buka OpenRouter.ai
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold">Dapatkan API Key</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Setelah login, buat API key baru di dashboard OpenRouter
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Tambahkan Environment Variable</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Di v0, buka Project Settings → Environment Variables dan tambahkan:
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mt-2 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    <span>OPENROUTER_API_KEY = your_api_key_here</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold">Selesai!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Chatbot Anda siap menggunakan DeepSeek R1 secara gratis
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
              <Zap className="w-4 h-4" />
              <span className="font-semibold">Keuntungan DeepSeek R1:</span>
            </div>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Model reasoning terbaru dan canggih</li>
              <li>• Gratis melalui OpenRouter</li>
              <li>• Performa tinggi untuk berbagai tugas</li>
              <li>• Mendukung bahasa Indonesia</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
