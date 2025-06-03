'use client'
import { snpifyAPI } from '@/lib/api/client'
import { useState } from 'react'

export default function ConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const testConnection = async () => {
    setStatus('testing')
    setMessage('Testing connection...')

    try {
      const health = await snpifyAPI.healthCheck()
      setStatus('success')
      setMessage(`✅ Backend connected successfully! Version: ${health.version}`)
    } catch (error: any) {
      setStatus('error')
      setMessage(`❌ Connection failed: ${error.message}`)
    }
  }

  return (
    <div className="p-4 border border-gray-600 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Backend Connection Test</h3>
      
      <button
        onClick={testConnection}
        disabled={status === 'testing'}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'testing' ? 'Testing...' : 'Test Backend Connection'}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          status === 'success' ? 'bg-green-500/10 text-green-400' :
          status === 'error' ? 'bg-red-500/10 text-red-400' :
          'bg-blue-500/10 text-blue-400'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}