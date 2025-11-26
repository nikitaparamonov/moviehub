import { PersonDetails } from "../../api/tmdb"
import { formatDate } from '../../utils/date'

interface PersonalInfoProps {
    person: PersonDetails
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({person}) => {
	return (
		<div className="person-left-section">
			{person.profile_path && (
				<img
					src={`https://image.tmdb.org/t/p/w400${person.profile_path}`}
					alt={person.name}
					className="person-photo"
				/>
			)}
			<div className="person-info">
				<h3>Personal Info</h3>

				{person.known_for_department && (
					<p>
						<strong>
							<bdi>Known For</bdi>
						</strong>
						{person.known_for_department}
					</p>
				)}
				{person.gender != null && (
					<p>
						<strong>
							<bdi>Gender</bdi>
						</strong>
						{person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Unknown'}
					</p>
				)}
				{person.birthday != null && (
					<p>
						<strong>
							<bdi>Birthday</bdi>
						</strong>
						{formatDate(person.birthday)}
					</p>
				)}
				{person.place_of_birth != null && (
					<p>
						<strong>
							<bdi>Place of Birth</bdi>
						</strong>
						{person.place_of_birth}
					</p>
				)}
				{person.deathday != null && (
					<p>
						<strong>
							<bdi>Died</bdi>
						</strong>
						{person.deathday}
					</p>
				)}
				{person.also_known_as != null && person.also_known_as.length > 0 && (
					<div>
						<strong>
							<bdi>Also Known As</bdi>
						</strong>
						{person.also_known_as.map((str, i) => (
							<p key={`${str}-${i}`} className="person-info-knownAs">
								{str}
							</p>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default PersonalInfo