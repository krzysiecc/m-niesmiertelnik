import React from 'react'

type User = {
	name: string
	age: number
	diseases: string[]
}

const sampleUser: User = {
	name: 'Anna Nowak',
	age: 29,
	diseases: ['astma', 'alergia']
}

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
				<div className="flex items-center gap-4">
					<div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">A</div>
					<div>
						<h2 className="text-lg font-semibold">{sampleUser.name}</h2>
						<p className="text-sm text-gray-500">{sampleUser.age} lat</p>
					</div>
				</div>

				<div className="mt-4">
					<h3 className="text-sm font-medium text-gray-700">Choroby</h3>
					{sampleUser.diseases.length ? (
						<ul className="mt-2 list-disc list-inside text-gray-600">
							{sampleUser.diseases.map((d) => (
								<li key={d} className="capitalize">{d}</li>
							))}
						</ul>
					) : (
						<p className="text-gray-600 mt-2">Brak</p>
					)}
				</div>

				<div className="mt-6 flex gap-2">
					<button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Edytuj</button>
					<button className="flex-1 border border-gray-200 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Usuń</button>
				</div>
			</div>
		</div>
	)
}

