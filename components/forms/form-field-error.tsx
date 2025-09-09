interface FormFieldErrorProps {
  error?: string
}

export function FormFieldError({ error }: FormFieldErrorProps) {
  if (!error) return null

  return <p className="text-sm text-red-500 mt-1">{error}</p>
}
