import { addSubtask } from "@/lib/to-dos/todosUtils";
import { format, utcToZonedTime } from "date-fns-tz";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { SubTaskForm } from "./SubTaskForm";
import { UpdateTodoForm } from "./UpdateTodoForm";
import UploadFiles from "./UploadFiles";

const formatDate = (newDate) => {
	const timezone = 'America/Santiago';
	const date = utcToZonedTime(new Date(newDate), timezone);
	return format(date, "dd-MM-yyyy HH:mm", { timeZone: timezone });
}

const getClassPriority = (priority) => {
	switch (priority) {
		case 'Baja':
			return 'badge-success';
		case 'Media':
			return 'badge-warning';
		case 'Alta':
			return 'badge-error';
		default:
			return null;
	}
}

export const TodosList = ({ todos }) => {

	const [visible, setVisible] = useState(false);
	const [form, setForm] = useState('');
	const [modalContent, setModalContent] = useState();

	const handleModalContent = (todo, form) => {
		setModalContent(todo);
		setVisible(!visible);
		setForm(form);
	}

	return (
		<>
			{
				!!modalContent && visible &&
				<>
					<div className={`modal ${visible ? 'modal-open' : null}`}>
						<div className="modal-box">
							<label onClick={() => handleModalContent(null, null)} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
							{
								form === 'update'
									?
									<UpdateTodoForm todo={modalContent} setVisible={setVisible} />
									:
									form === 'add'
										?
										<SubTaskForm parentId={modalContent.id} todo={modalContent} setVisible={setVisible} />
										:
										null
							}
						</div>
					</div>
				</>
			}

			{
				todos.map((todo) => (
					<div key={todo.id} className="card w-8/12 shadow-xl px-0">
						<div className="card-body">
							<div className="flex flex-row flex-wrap justify-between items-center gap-2">
								<div className="card-title">
									{todo.title}
								</div>
								<div className="grow flex justify-start gap-2">
									<div className="tooltip" data-tip="Estado">
										<span className="badge cursor-default">{todo.status}</span>
									</div>
									<div className="tooltip" data-tip="Termino">
										<span className="badge cursor-default badge-ghost">{formatDate(todo.deadline)}</span>
									</div>
									<div className="tooltip" data-tip="Prioridad">
										<span className={`badge cursor-default ${getClassPriority(todo.priority)}`}>{todo.priority}</span>
									</div>
								</div>

								<div className="flex gap-2">
									<button className="btn btn-ghost" onClick={() => handleModalContent(todo, 'update')}>Ver Tarea</button>
								</div>
							</div>

							<UploadFiles attachments={todo.attachments} todoId={todo.id} />

							<p className="text-base-content text-md text-opacity-80">
								Contenido: {todo.content}
							</p>


							<div className="divider">Subtareas</div>
							<div className="flex flex-row justify-between">
								<h2 className="text-lg font-bold"> Subtareas: </h2>
								<button className="btn btn-ghost" onClick={() => handleModalContent(todo, 'add')}>
									Añadir subtarea
								</button>
							</div>
							{
								todo.subTasks.length === 0 ?
									<div className="alert shadow-lg flex justify-center">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
										<span>No hay subtareas.</span>
									</div>
									:
									<div className="overflow-auto">
										<table className="table table-compact w-full overflow-scroll">
											<thead>
												<tr>
													<th>Título</th>
													<th>Contenido</th>
													<th>Tipo</th>
													<th>Owners</th>
													<th>Termino</th>
													<th>Prioridad</th>
													<th>Status</th>
													<th>Acción</th>
												</tr>
											</thead>
											<tbody>
												{
													todo.subTasks.map((todo, idx) => (
														<tr className="hover" key={todo.id}>
															<th>{todo.title}</th>
															<td>{todo.content}</td>
															<td>{todo.type}</td>
															<td>{JSON.stringify(todo.owners)}</td>
															<td><span className="badge badge-sm badge-ghost">{formatDate(todo.deadline)}</span></td>
															<td><span className={`badge badge-sm ${getClassPriority(todo.priority)}`}>{todo.priority}</span></td>
															<td>{todo.status}</td>
															<td><button className="btn btn-ghost btn-xs" onClick={() => handleModalContent(todo, 'update')}>Ver Tarea</button></td>
														</tr>
													))
												}
											</tbody>
										</table>
									</div>
							}
						</div>
					</div>
				))
			}




		</>
	)
}
