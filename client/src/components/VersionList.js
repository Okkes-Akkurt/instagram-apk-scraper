import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VersionList = ({ onVersionClick, onVersionDelete, onVersionUpdate }) => {
	const [versions, setVersions] = useState([]);

	useEffect(() => {
		fetchVersions();
	}, []);

	const fetchVersions = async () => {
		try {
			const response = await axios.get('http://localhost:3001/versions');
			const data = response.data.versions;
			setVersions(data);
		} catch (error) {
			console.error('Listeleme hatası:', error.message);
		}
	};

	const handleDelete = async (versionId) => {
		try {
			console.log(`Deleting version with ID: ${versionId}`);
			await axios.delete(`http://localhost:3001/versions/${versionId}`);

			// Update state after deletion
			setVersions((prevVersions) => prevVersions.filter((version) => version._id !== versionId));
		} catch (error) {
			console.error('Silme hatası:', error.message);
		}
	};



	return (
		<div>
			<h2>Instagram APK Sürümleri</h2>
			<ol className='olcards'>
				{versions.map((version) => (
					<li
						key={version._id}
						style={{ '--cardColor': version.cardColor || '#fc374e' }}>
						<div className='content'>
							<div>
								<span>version : </span>
								{version.version}
							</div>
							<div>
								<span>releaseDate : </span>
								{version.releaseDate}
							</div>
							<div>
								<span>variantCount : </span>
								{version.variants.length}
							</div>
							<div className='buttons'>
								<button onClick={() => onVersionClick(version._id)}>Detay</button>
								<button onClick={() => handleDelete(version._id)}>Sil</button>
							</div>
						</div>
					</li>
				))}
			</ol>
		</div>
	);
};

export default VersionList;
