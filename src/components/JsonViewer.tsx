'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface JsonViewerProps {
  data: any
  className?: string
  maxDepth?: number
}

interface JsonNodeProps {
  data: any
  keyName?: string
  depth: number
  maxDepth: number
  isLast: boolean
}

function JsonNode({ data, keyName, depth, maxDepth, isLast }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2) // Auto-expand first 2 levels

  if (data === null) {
    return (
      <div className="flex">
        {keyName && (
          <>
            <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
            <span className="text-slate-400 mx-2">:</span>
          </>
        )}
        <span className="text-slate-500 italic">null</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    )
  }

  if (typeof data === 'string') {
    return (
      <div className="flex">
        {keyName && (
          <>
            <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
            <span className="text-slate-400 mx-2">:</span>
          </>
        )}
        <span className="text-green-600">&quot;{data}&quot;</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    )
  }

  if (typeof data === 'number') {
    return (
      <div className="flex">
        {keyName && (
          <>
            <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
            <span className="text-slate-400 mx-2">:</span>
          </>
        )}
        <span className="text-purple-600">{data}</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    )
  }

  if (typeof data === 'boolean') {
    return (
      <div className="flex">
        {keyName && (
          <>
            <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
            <span className="text-slate-400 mx-2">:</span>
          </>
        )}
        <span className="text-orange-600">{data.toString()}</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    )
  }

  if (Array.isArray(data)) {
    const isEmpty = data.length === 0

    if (isEmpty) {
      return (
        <div className="flex">
          {keyName && (
            <>
              <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
              <span className="text-slate-400 mx-2">:</span>
            </>
          )}
          <span className="text-slate-400">[]</span>
          {!isLast && <span className="text-slate-400">,</span>}
        </div>
      )
    }

    return (
      <div>
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center mr-2 hover:bg-slate-100 rounded px-1 py-0.5 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-slate-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-500" />
            )}
          </button>
          {keyName && (
            <>
              <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
              <span className="text-slate-400 mx-2">:</span>
            </>
          )}
          <span className="text-slate-400">[</span>
          {!isExpanded && (
            <>
              <span className="text-slate-500 text-xs ml-1">{data.length} items</span>
              <span className="text-slate-400">]</span>
              {!isLast && <span className="text-slate-400">,</span>}
            </>
          )}
        </div>

        {isExpanded && (
          <div className="ml-6 border-l border-slate-200 pl-4">
            {data.map((item, index) => (
              <JsonNode
                key={index}
                data={item}
                depth={depth + 1}
                maxDepth={maxDepth}
                isLast={index === data.length - 1}
              />
            ))}
            <div className="flex">
              <span className="text-slate-400">]</span>
              {!isLast && <span className="text-slate-400">,</span>}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data)
    const isEmpty = keys.length === 0

    if (isEmpty) {
      return (
        <div className="flex">
          {keyName && (
            <>
              <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
              <span className="text-slate-400 mx-2">:</span>
            </>
          )}
          <span className="text-slate-400">{'{}'}</span>
          {!isLast && <span className="text-slate-400">,</span>}
        </div>
      )
    }

    return (
      <div>
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center mr-2 hover:bg-slate-100 rounded px-1 py-0.5 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-slate-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-500" />
            )}
          </button>
          {keyName && (
            <>
              <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
              <span className="text-slate-400 mx-2">:</span>
            </>
          )}
          <span className="text-slate-400">{'{'}</span>
          {!isExpanded && (
            <>
              <span className="text-slate-500 text-xs ml-1">{keys.length} keys</span>
              <span className="text-slate-400">{'}'}</span>
              {!isLast && <span className="text-slate-400">,</span>}
            </>
          )}
        </div>

        {isExpanded && depth < maxDepth && (
          <div className="ml-6 border-l border-slate-200 pl-4">
            {keys.map((key, index) => (
              <JsonNode
                key={key}
                data={data[key]}
                keyName={key}
                depth={depth + 1}
                maxDepth={maxDepth}
                isLast={index === keys.length - 1}
              />
            ))}
            <div className="flex">
              <span className="text-slate-400">{'}'}</span>
              {!isLast && <span className="text-slate-400">,</span>}
            </div>
          </div>
        )}

        {isExpanded && depth >= maxDepth && (
          <div className="ml-6 border-l border-slate-200 pl-4">
            <div className="text-slate-500 text-xs italic py-1">
              Maximum depth reached. Object has {keys.length} keys.
            </div>
            <div className="flex">
              <span className="text-slate-400">{'}'}</span>
              {!isLast && <span className="text-slate-400">,</span>}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Fallback for other types
  return (
    <div className="flex">
      {keyName && (
        <>
          <span className="text-blue-600 font-medium">&quot;{keyName}&quot;</span>
          <span className="text-slate-400 mx-2">:</span>
        </>
      )}
      <span className="text-slate-700">{String(data)}</span>
      {!isLast && <span className="text-slate-400">,</span>}
    </div>
  )
}

export function JsonViewer({ data, className = '', maxDepth = 10 }: JsonViewerProps) {
  return (
    <div className={`bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-auto font-mono text-sm ${className}`}>
      <JsonNode data={data} depth={0} maxDepth={maxDepth} isLast={true} />
    </div>
  )
}