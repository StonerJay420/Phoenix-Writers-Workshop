import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db';
import { ZenEditor } from '../modules/editor';
import { Button } from '../ui/components/Button';

export const EditorDemo: React.FC = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | undefined>();
  const [showEditor, setShowEditor] = useState(false);

  // Get all documents
  const documents = useLiveQuery(() => db.documents.toArray(), []);

  // Get selected document
  const selectedDocument = useLiveQuery(
    () => (selectedDocumentId ? db.documents.get(selectedDocumentId) : undefined),
    [selectedDocumentId]
  );

  // Auto-select first document
  useEffect(() => {
    if (documents && documents.length > 0 && !selectedDocumentId) {
      setSelectedDocumentId(documents[0]?.id);
      setShowEditor(true);
    }
  }, [documents, selectedDocumentId]);

  const handleCreateDocument = async () => {
    const newDoc = await db.documents.add({
      title: `New Document ${new Date().toLocaleString()}`,
      content: '<p>Start writing...</p>',
      projectId: 'demo-project',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setSelectedDocumentId(newDoc);
    setShowEditor(true);
  };

  const handleSelectDocument = (id: number) => {
    setSelectedDocumentId(id);
    setShowEditor(true);
  };

  const handleSave = (content: string) => {
    console.log('Document saved:', content);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-4">
          <Button onClick={handleCreateDocument} fullWidth className="mb-4">
            New Document
          </Button>

          <h3 className="font-semibold text-gray-700 mb-2">Documents</h3>
          <div className="space-y-1">
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelectDocument(doc.id!)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedDocumentId === doc.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="font-medium truncate">{doc.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic p-2">
                No documents. Create one to start writing!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {showEditor && selectedDocument ? (
          <>
            {/* Document Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <input
                type="text"
                value={selectedDocument.title}
                onChange={async (e) => {
                  if (selectedDocumentId) {
                    await db.documents.update(selectedDocumentId, {
                      title: e.target.value,
                      updatedAt: new Date(),
                    });
                  }
                }}
                className="text-2xl font-bold w-full border-none focus:outline-none"
                placeholder="Document Title"
              />
            </div>

            {/* Editor */}
            <div className="flex-1">
              <ZenEditor
                key={selectedDocumentId}
                documentId={selectedDocumentId}
                initialContent={selectedDocument.content}
                placeholder="Start writing your story..."
                onSave={handleSave}
                autosaveDelay={1000}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No document selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a document from the sidebar or create a new one.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreateDocument} variant="primary">
                  Create New Document
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorDemo;
