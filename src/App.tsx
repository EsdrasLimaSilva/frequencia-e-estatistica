import { FormEvent, useRef, useState } from "react";
import useStats, { Class } from "./hooks/useStats";

export default function App() {
	const [data, setData] = useState<number[]>([]);
	const [classes, setClasses] = useState<Class[]>([]);
	const [decimalPlaces, setDecimalPlaces] = useState<number>(0);

	const { calcClasses } = useStats();
	const textAreaRef = useRef(null);
	const inputRef = useRef(null);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		const numbersString = (textAreaRef.current! as HTMLTextAreaElement).value
			.replaceAll(" ", "")
			.trim()
			.split(",");

		const numbers = numbersString.map((numStr) => Number(numStr));
		const decimalPlaces: number = +(inputRef.current! as HTMLInputElement).value;

		setData(numbers);
		setDecimalPlaces(decimalPlaces);
		setClasses(calcClasses(numbers, decimalPlaces));
	};

	return (
		<>
			<header className="bg-white flex justify-center items-center w-full py-4">
				<h1 className="font-bold text-2xl text-green-800 italic h-fit">
					Frequência & Estatística
				</h1>
			</header>
			<main className="px-4 w-screen min-h-screen text-slate-900 py-16 bg-gray-50 md:px-0">
				<form className="mx-auto w-full max-w-xl my-4" onSubmit={handleSubmit}>
					<label className="flex flex-col">
						Números separados por vírgula
						<textarea
							cols={30}
							rows={10}
							className="p-4 border-2 border-slate-700 outline-none"
							required
							ref={textAreaRef}
						></textarea>
						<input
							type="number"
							placeholder="casas decimais"
							className="p-2 border-2 border-slate-600 mt-4"
							ref={inputRef}
							required
						/>
						<button
							type="submit"
							className="px-4 py-1 bg-orange-600 text-white font-bold rounded-md w-20 my-2 mx-auto"
						>
							enviar
						</button>
					</label>
				</form>

				<div className="max-w-2xl mx-auto">
					<h2 className="text-lg font-bold text-slate-800 mb-4">Dados ordenados</h2>
					<ul className="text-sm flex flex-row text-xl text-center gap-3 flex-wrap md:text-lg">
						{data.map((num) => (
							<li className="bg-slate-700 text-white font-bold p-2 w-[40px] h-[40px]">
								{num}
							</li>
						))}
					</ul>
				</div>

				{data.length > 0 ? (
					<>
						<table>
							<thead>
								<tr>
									<th>n°</th>
									<th>Classe</th>
									<th title="Ponto Médio">PM</th>
									<th title="Frequência Absoluta">FA</th>
									<th title="Frequência Absoluta Acumulada">FAC</th>
									<th title="Frequência Relativa">FR</th>
									<th title="Frequência Relativa Acumulada">FRA</th>
								</tr>
							</thead>
							<tbody>
								{classes.map((classe, i) => (
									<tr key={(i * Math.random()) % 10}>
										<td>{i + 1}</td>
										<td>
											{classe.lower.value.toFixed(decimalPlaces)} |---
											{classe.upper.included ? "| " : " "}
											{classe.upper.value.toFixed(decimalPlaces)}
										</td>
										<td>{classe.mediumPoint}</td>
										<td>{classe.absFrequency}</td>
										<td>{classe.absAcumFrequency}</td>
										<td>
											{(classe.relFrequency * 100).toFixed(decimalPlaces)}%
										</td>
										<td>
											{(classe.relAcumFrequency * 100).toFixed(decimalPlaces)}
											%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				) : (
					<h2 className="text-center text-blue-900 font-bold mt-4">Adicione dados</h2>
				)}
			</main>
		</>
	);
}
