// app/proofread/page.tsx
'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, Check, Copy, RefreshCcw } from 'lucide-react'
import { proofreadText, proofreadTextHuggingFace } from './action'
import { Button } from '@/components/ui/button'

export type Tone = {
  name: string
  description: string
}

export const tones: Tone[] = [
  {
    name: 'Professional',
    description: 'Formal, clear, and concise language',
  },
  {
    name: 'Chill',
    description: 'Relaxed and conversational tone',
  },
  {
    name: 'Funky',
    description: 'Creative and playful language',
  },
]

export default function ProofreadPage() {
  const [inputText, setInputText] = useState('')
  const [revisedText, setRevisedText] = useState('')
  const [selectedTone, setSelectedTone] = useState<string>('Professional')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleProofread = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await proofreadTextHuggingFace(inputText, selectedTone)
      setRevisedText(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process text')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(revisedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err)
    }
  }

  const resetProofread = () => {
    setRevisedText('')
    setSelectedTone('Professional')
  }

  const resetOriginalInput = () => {
    setInputText('')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto rounded-xl shadow-lg p-6 bg-slate-50 dark:bg-slate-900">
        <h1 className="text-3xl font-bold mb-6 text-center">proofread.this</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <label className="text-lg font-medium">Original Text</label>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetOriginalInput}
                className="h-8 w-8"
                aria-label="Reset original text"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </h2>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {revisedText ? (
                <div className="flex items-center justify-between">
                  <label className="text-lg font-medium">Proofread Text</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetProofread}
                      className="h-8 w-8"
                      aria-label="Reset proofread text"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-8 w-8"
                      aria-label="Copy proofread text"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                'Tone Selection'
              )}
            </h2>
            {revisedText ? (
              <textarea
                value={revisedText}
                readOnly
                className="w-full h-64 p-4 border rounded-lg"
              />
            ) : (
              <div className="space-y-4">
                {tones.map((tone) => (
                  <div
                    key={tone.name}
                    onClick={() => setSelectedTone(tone.name)}
                    className={`p-4 border rounded-lg cursor-pointer transition  
                      
                      ${
                        selectedTone === tone.name
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : 'hover:bg-slate-800 dark:hover:bg-slate-500'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{tone.name}</h3>
                        <p className="text-sm">{tone.description}</p>
                      </div>
                      {selectedTone === tone.name && <CheckCircle2 className="text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Button
            onClick={handleProofread}
            disabled={!inputText || isLoading}
            className={`px-6 py-3 font-semibold 
              ${inputText && isLoading && 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 animate-spin" />
                Processing...
              </div>
            ) : (
              'Proofread & Customize Tone'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
