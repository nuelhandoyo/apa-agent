import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    const apiKey =
      process.env.OPENROUTER_API_KEY || "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"

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API key tidak ditemukan.",
          message: "Terjadi kesalahan konfigurasi API key.",
        },
        { status: 200 },
      )
    }

    const messages = [
      {
        role: "system",
        content: `Anda adalah APA Agent, agen kecerdasan buatan yang dirancang khusus untuk mata kuliah Manajemen Proyek. Peran utama Anda adalah berfungsi sebagai asisten pembelajaran interaktif.

INSTRUKSI:
• Tugas Anda: Berikan jawaban yang akurat dan relevan hanya berdasarkan dokumentasi yang tersedia.
• Fokus: Jawab pertanyaan mahasiswa, jelaskan konsep, dan berikan contoh yang relevan dengan materi yang telah diunggah.
• Batasan: Jika ada pertanyaan di luar cakupan materi yang diberikan, jawablah dengan sopan bahwa informasi tersebut tidak ada dalam dokumentasi yang Anda miliki.
• Gaya Komunikasi: Gunakan bahasa yang jelas, lugas, dan mudah dipahami. Hindari jargon yang tidak perlu.

CONTOH RESPONS JIKA TIDAK TAHU:
"Maaf, saya tidak memiliki informasi mengenai topik tersebut dalam dokumentasi yang saya miliki."

PENDEKATAN PEMBELAJARAN:
• Berikan penjelasan konsep dengan contoh praktis
• Struktur jawaban dengan bullet points atau numbering untuk kejelasan
• Dorong pemahaman mendalam dengan pertanyaan follow-up jika diperlukan
• Hubungkan konsep dengan aplikasi nyata dalam dunia kerja
• Jawab dalam bahasa Indonesia kecuali diminta sebaliknya`,
      },
      // Tambahkan history percakapan (maksimal 10 pesan terakhir untuk efisiensi)
      ...history.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    // Panggil OpenRouter API dengan DeepSeek R1
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "APA Agent - Project Management Learning Assistant",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free", // Model gratis DeepSeek R1
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenRouter API Error:", errorData)

      return NextResponse.json({
        message: `Terjadi kesalahan saat menghubungi sistem: ${errorData.error?.message || "Unknown error"}\n\nPastikan koneksi internet Anda stabil.`,
      })
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || "Maaf, saya tidak dapat memberikan respons saat ini."

    return NextResponse.json({
      message: aiMessage,
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      {
        message: "Terjadi kesalahan internal. Silakan coba lagi nanti.",
      },
      { status: 500 },
    )
  }
}
