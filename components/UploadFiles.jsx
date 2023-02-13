import { addAttachmentToTodo, deleteAttachmentOfTodo } from "@/lib/to-dos/todosUtils";
import { useMutation, useQueryClient } from "react-query";

export default function UploadFiles({ attachments = [], todoId }) {

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({ target }) => {
			return addAttachmentToTodo(todoId, target.files, attachments);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['todos']);
		}
	});


	const deleteMutation = useMutation({
		mutationFn: (file) => {
			return deleteAttachmentOfTodo(todoId, file, attachments);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['todos']);
		}
	});

	return (
		<div className="flex items-center">
			<input
				type="file"
				multiple
				disabled={mutation.isLoading}
				className="file-input file-input-bordered file-input-xs w-full max-w-xs"
				onChange={mutation.mutate}
			/>
			{
				!!attachments && attachments.length !== 0 && 
				<div className="dropdown">

					<label tabIndex={0} className="btn m-1 btn-xs">Archivos adjuntos</label>
					<div className="dropdown-content">
						<ul tabIndex={0} className="p-2 shadow bg-base-100 rounded-box w-52">
							{
								attachments.map(file => (

									<li className="m-2 flex flex-row justify-between items-center" key={file}>
										<a className="link w-1/2" href={file} target="_blank" rel="noopener noreferrer">Link</a>
										<button type="button" disabled={deleteMutation.isLoading} onClick={() => deleteMutation.mutate(file)} className="btn btn-error btn-sm w-1/2">Borrar</button>
									</li>
								))
							}
						</ul>
					</div>
				</div>
			}
		</div>
	)



}
