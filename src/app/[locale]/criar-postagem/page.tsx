'use client';

import PostForm from '@/components/PostForm';

export default function CriarPostagemPage() {
  return (
    <div className="max-w-lg mx-auto mt-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Nova Postagem</h1>
        <p className="text-gray-500 text-sm mb-6">
          Preencha os dados abaixo. Sua foto aparece no ranking após o pagamento ser aprovado.
        </p>
        <PostForm />
      </div>
    </div>
  );
}
