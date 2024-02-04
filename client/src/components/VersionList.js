import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VersionList = ({ onVersionClick }) => {
	const [versions, setVersions] = useState([]);

	useEffect(() => {
		const fetchVersions = async () => {
			try {
				const response = await axios.get('http://localhost:3001/versions');
				const data = response.data.versions;
				console.log(data);

				setVersions(data);
			} catch (error) {
				console.error('Listeleme hatası:', error.message);
			}
		};

		fetchVersions();
	}, []);

	const handleVersionClick = async (versionId) => {
		try {
			const response = await axios.get(
				`http://localhost:3001/${versionId}`,
			);
			onVersionClick(response.data);
		} catch (error) {
			console.error('Veri çekme hatası:', error.message);
		}
	};

	return (
		<div>
			<h2>Instagram APK Sürümleri</h2>
			<ul>
				{versions.map((version) => (
					<li key={version._id}>
						{version.version} - {version.releaseDate}
						<button onClick={() => handleVersionClick(version._id)}>Detay</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default VersionList;
