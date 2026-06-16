import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from 'store/createStore';
import { IFormKey } from 'types';

const normalizeFormKey = (formKey: IFormKey | string) => {
	const normalizedKey = formKey
		.toString()
		.split('/')
		.filter(Boolean)
		.pop()
		?.toUpperCase();

	return normalizedKey as IFormKey | undefined;
};

const toPascalCase = (value: string) => {
	return value
		.toLowerCase()
		.split(/[_\-\s]+/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
};

const getResetActionType = (formKey: IFormKey | string) => {
	const normalizedKey = normalizeFormKey(formKey);

	if (!normalizedKey) {
		return null;
	}

	return `${normalizedKey.toLowerCase()}/reset${toPascalCase(normalizedKey)}Form`;
};

export const useFormActions = () => {
	const dispatch = useDispatch<AppDispatch>();

	const resetForm = useCallback(
		(formKey: IFormKey | string) => {
			const actionType = getResetActionType(formKey);

			if (!actionType) {
				return;
			}
			dispatch({ type: actionType });
		},
		[dispatch]
	);

	return { resetForm };
};


