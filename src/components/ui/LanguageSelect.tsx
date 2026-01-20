import { Language } from "../../api"

interface LanguageSelectProps {
	languages: Language[]
	value: string | null
	onChange: (lang: string | null) => void
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({ languages, value, onChange }) => {
	return (
		<select
			value={value || ''}
			onChange={(e) => onChange(e.target.value || null)}
			className=""
			aria-label="Select movie language"
		>
			<option value="">All Languages</option>
			{languages.map((lang) => (
				<option key={lang.iso_639_1} value={lang.iso_639_1}>
					{lang.english_name}
				</option>
			))}
		</select>
	)
}
