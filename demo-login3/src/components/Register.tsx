import { useEffect, useState } from 'react';
import { useCurrentWallet, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import "./register.css";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { GetOwnedObjectsParams, PaginatedObjectsResponse, SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
// import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const secretKey = 'your-secret-key';  // Replace with your own secret key for encryption

// Encrypt a string
interface SuiParsedData {
  dataType: string;
  disassembled?: { [key: string]: unknown; };
  // Add other properties that may exist in SuiParsedData
}

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMzZmYTZhNi0yY2RkLTRkNjktODU2Ny03ZTFjMjJkNTg4ZDQiLCJlbWFpbCI6InNodWJyYXRoa2dAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjM0M2Q1OTc0MWMwZTY0YmQ2YjE1Iiwic2NvcGVkS2V5U2VjcmV0IjoiNzc5YmI5MzAxNTc1ZTkxOGY3NmZjNmI3YWYyNWI5MWZlNjhmNDRlOWI0OTU4YWJlYzIxOWMzYTUxZjIzZGUyZCIsImlhdCI6MTcyMzk3ODUyMX0.at1zVZONfrfLFz1Cmp9UzHdK6SDeaQU8uRC5-r3Qp4E';
const GATEWAY = "chocolate-selected-asp-545.mypinata.cloud";
const objectId = '0xe6c70f0dfb34cc4017d156d0d194a90456540b8a864b3b0b5e7617518108584c'
const Register = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const [activeTab, setActiveTab] = useState('register'); // Tracks the current active tab
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [nftData, setNftData] = useState<NftFields | null>(null); // Use NftFields type
  const [contentList, setContentList] = useState<any[]>([]);
  const [adminNftDetails, setAdminNftDetails] = useState<any[]>([]);  // or use a more specific type if possible

  const [walletAddress, setWalletAddress] = useState('');
  const [nftDetails, setNftDetails] = useState([]);
  const [error, setError] = useState(null);

  const { connectionStatus } = useCurrentWallet();
  const [objId, setObjId] = useState<string>('');
  const [objectId, setObjectId] =  useState<string | undefined>(undefined);
  const [ownedObjects, setOwnedObjects] = useState<SuiObjectResponse[]>([]);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  // const [wallet_address,setWalletAddress] = useState<any>(null);
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransaction();
  const [activeScreen, setActiveScreen] = useState<'main' | 'admin' | 'user'>('main');
  const [showNftForm, setShowNftForm] = useState(false);
  const [showNftCards, setShowNftCards] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null); // Track which card's dropdown is open

  const [editIndex, setEditIndex] = useState<number | null>(null); // Index of the card being edited
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});


const handleEditClick = (index: number) => {
  setEditIndex(index); 
  setEditFormData(contentList[index]);
};


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
  const value = e.target.value;
  setEditFormData((prevData) => ({
      ...prevData,
      [field]: value,
  }));
};


  // Perform your view NFT logic here
  // Hide the button after it's clicked
  const toggleDropdown = (index: number) => {
      setDropdownIndex(dropdownIndex === index ? null : index); // Toggle dropdown for the clicked card
  };


  const handleOptionClick = (option: string, index: number) => {
    console.log(`Option '${option}' clicked on card ${index + 1}`);
    // Handle different options here (e.g., share, edit, burn)
};
  interface NftFields {
    approved: boolean;
    bio: string;        // Change this to string since we're converting ASCII to string
    emailId: string;    // Change to string
    id: { id: string };
    name: string;       // Change to string
    owner: string;
    phone_number: string; // Change to string
  }


  const handleAdminClick = () => {
    setActiveScreen('admin');
  };


  const getObject = async (nftId:any) => {
    const options = {
        showType: true,
        showContent: true,
        showOwner: true,
        showPreviousTransaction: true,
    }; // Define any options needed for the request

    // Create params including the required 'id'
    const params = {
        id: nftId, // Include the NFT ID here
        options: options,
        filter: {
            MoveModule: {
                module: 'userprofile',
                package: '0xe79573aa07762cf37f2a65c1f7d84fe22095da4d28dcf28d27669ed2c85aae03',
            }
        }
    };

    try {
        // Log parameters to verify they're correct
        console.log(`Fetching NFT details for NFT ID: ${nftId}`);
        const response = await client.getObject(params);

        // Check if the response contains the expected data
        if (response && response.data) {
            console.log('NFT Details:', response.data);
            return response.data; // Return the expected NFT details
        } else {
            console.error(`No data found for NFT ID: ${nftId}`);
            return null; // Return null if no data is found
        }
    } catch (err) {
        console.error(`Error fetching object for NFT ID ${nftId}:`, err);
        return null; // Return null on error
    }
};

interface NftData {
  nft_id: string; // or 'number' depending on your API response
  // Add other fields if needed
}


function isObjectWithId(value: unknown): value is { id: string | number } {
  return typeof value === 'object' && value !== null && 'id' in value;
}
const handleAdminViewNftClick = async () => {
  try {
    console.log("hello")
    // Step 1: Get all NFTs
    setIsButtonVisible(false);
    const response = await axios.get<NftData[]>('http://127.0.0.1:8000/api/nfts/');
    const nftIds = response.data.map(nft => nft.nft_id); // Adjust based on your API response structure
    
    console.log('NFT IDs:', nftIds); // Log NFT IDs

    // Step 2: Fetch details for each NFT using getObject
    const detailsPromises = nftIds.map(nftId =>  getObject(nftId));
    const details = await Promise.all(detailsPromises);
    
    console.log('NFT Detailsmmmmmmmmm:', details); // Log fetched details

    // Filter out any null values (in case of errors)
    const filteredDetails = details.filter(detail => detail !== null);

    // Decode content
    const newContentList: any[] = [];
    filteredDetails.forEach((item, index) => {
      if (index === 0) return; // Skip the first object

      const content = item?.content?.fields; 
      if (content) {
        console.log("contents are :",content)
        const decodedContent: any = {};

        for (const [key, value] of Object.entries(content)) {
          // Special handling for 'id'
          if (key === 'id' && isObjectWithId(value)) {
            decodedContent['id'] = value.id;  // Safely access `id`
            continue;
          }

          // Special handling for 'owner'
          if (key === 'owner') {
            decodedContent['owner'] = value;
            continue;
          }

          // Convert ASCII arrays to strings for other fields
          if (Array.isArray(value) && value.every(v => typeof v === 'number')) {
            const decryptedValue = decryptData(asciiArrayToString(value)); // Apply decryption
            decodedContent[key] = decryptedValue; // Store the decrypted data
          } else {
            decodedContent[key] = value;
          }
        }

       

        newContentList.push(decodedContent);
      }
    });

    console.log("mijijxsdcjbsdjcbdsj",newContentList)

    // Set the decoded content into the new state
    setAdminNftDetails(newContentList);  // Update the state with the new content list

  } catch (err:any) {
    console.error('Error fetching NFTs:', err);
    setError(err);
  }
};

  const handleUserClick = () => {
    setActiveScreen('user');
  };

  const handleBackClick = () => {
    setActiveScreen('main');
    setShowNftForm(false);
    setShowNftCards(false);
  };




  useEffect(() => {
    if (connectionStatus === "connected") {
        const fetchObjects = async () => {
            const myAddress = account?.address.toString();
            if (myAddress) {
                try {

                  const options = {
                    showType: true,     
                    showContent: true,   
                    showOwner: true,       
                    showPreviousTransaction: true,
                };
                  const p = {
                    options:options,
                    id: '0x75cdebcf26a8630dbdc490823b77b02ab3cc2f695515f0c5861d9dc61ae9a0c6'
                };


                const re = await client.getObject(p); 


                console.log("chjbdcbhv hs bhsdcghdc",re)  
                    const params: GetOwnedObjectsParams = {
                        owner: myAddress,
                        filter: {
                            MoveModule: {
                                module: 'userprofile',
                                package: '0x93ec9d8aa6944de58b50ae40e194c1863ef2a8714f2244a19de01d686a1a7d32',
                            }
                        }
                    };
                    const response: PaginatedObjectsResponse = await client.getOwnedObjects(params);

                   
                } catch (error) {
                    console.log("Error fetching owned objects:", error);
                }
            }
        };

     

        fetchObjects();
    } else {
        console.log("Not connected to the wallet");
    }
}, [connectionStatus]);


  const handleCreateNftClick = () => {
    setShowNftForm(true);
    setShowNftCards(false); 



 
  }


  const close = async()=>{
    setEditIndex(NaN)
  }
  const handleEditButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const editedCard = { ...editFormData };
 
    await EditButton(editedCard.id, editedCard);
    setEditIndex(null);
};


const EditButton = (id: string, updatedData: Record<string, any>) => {

 
  const EditUser = async () => {
    const tx = new Transaction();
    const packageObjectId = '0xe79573aa07762cf37f2a65c1f7d84fe22095da4d28dcf28d27669ed2c85aae03';


    const encryptedUsername = encryptData(updatedData['name']);
    const encryptedEmail = encryptData(updatedData['emailId']);
    const encryptedPhone = encryptData(updatedData['phone_number']);
    const encryptedBio = encryptData(updatedData['bio']);
    tx.setGasBudget(10000000);
    tx.moveCall({
      target: `${packageObjectId}::userprofile::edit_nft`,
      arguments: [
        tx.object('0x0c52efc722c5205501557f54aafb71070a22c1bef43cf24b1cd9616b19fa9986'),
        tx.object(updatedData['id']),
        tx.pure.string(encryptedUsername),
        tx.pure.string(encryptedEmail),
        tx.pure.string(encryptedPhone),
        tx.pure.string(encryptedBio),
      
      ],
    });

    try {
      const response = signAndExecuteTransactionBlock(
        {
          transaction: tx as any,
        },
        
        {
          onSuccess: ({ digest, effects }) => {
            client
              .waitForTransaction({
                
                digest: digest,
               
              })
              .then((tx) => {
                const objectId = tx.effects?.mutated?.[0]?.reference?.objectId;
                if (objectId) {
                    alert("NFT EDITED")
                }
              });
    
             
          },
          onError(error) {
            console.log('error', error);
            alert("ERROR")
          },
        }
      );
    
    
     
      alert("NFT EDITED SUCCESSFULLY")
      setActiveTab('viewNFT'); 
    } catch (error) {

      alert("ERROR")

    }

};
EditUser()
  
};



const handleEditSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (editIndex !== null) {
      // Update the content list with the edited data
      const updatedContentList = [...contentList];
      updatedContentList[editIndex] = editFormData;
      setContentList(updatedContentList);
      setEditIndex(null); // Exit edit mode
  }
};

const decryptData = (encryptedData: string, key: string) => {
  return CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
};

const handleViewNftClick = () => {
  const decryptData = (encryptedData: string, secretKey: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  
  const handleViewNftClick = async () => {
    // Your existing code
    const myAddress = account?.address.toString();
    if (myAddress) {
      try {
        const response = await client.getOwnedObjects(params);
  
        const newContentList: any[] = [];
        for (const item of response.data) {
          const nftId = item.data?.content?.fields.id;
          const nftSecretKey = await fetchSecretKeyFromDatabase(nftId);
  
          const decodedContent: any = {};
          for (const [key, value] of Object.entries(item.data?.content?.fields || {})) {
            if (Array.isArray(value) && value.every(v => typeof v === 'number')) {
              const decryptedValue = decryptData(asciiArrayToString(value), nftSecretKey);
              decodedContent[key] = decryptedValue;
            } else {
              decodedContent[key] = value;
            }
          }
          newContentList.push(decodedContent);
        }
  
        setContentList(newContentList);
      } catch (error) {
        console.log("Error fetching owned objects:", error);
      }
    }
  };
  
  // Define a function to retrieve the secret key from your database
  const fetchSecretKeyFromDatabase = async (nftId: string): Promise<string> => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/nfts/secret-key/${nftId}`);
      return response.data.secret_key;
    } catch (error) {
      console.error('Error fetching secret key:', error);
      throw error;
    }
  };
  

  const handleBurnClick = (nftIndex:number) => {
    console.log(`Burn NFT ${nftIndex + 1}`);
  };


  const generateRandomObjectId = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0].toString(); // Converts the random number to a string
};




const generateSecretKey = () => {
  return CryptoJS.lib.WordArray.random(16).toString(); // Generate a random 128-bit key
};





const handleShare = async (id: any) => {
  const secretKey = generateSecretKey(); // Generate a unique key for this NFT
  const encryptedData = encryptData(id.toString(), secretKey); // Encrypt NFT data with the unique key

  const requestBody = {
    object_id: generateRandomObjectId(),
    nft_id: encryptedData, // Use the encrypted NFT ID
    approved: "not approved",
    secret_key: secretKey // Send the unique key for storage in the database
  };

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/nfts/', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Share successful:', response.data);
    alert('Share successful');
  } catch (error: any) {
    if (error?.response) {
      console.error('Error response:', error?.response?.data);
      alert('Error sharing NFT');
    } else {
      console.error('Error sharing NFT:', error);
      alert(`Error sharing NFT: ${error}`);
    }
  }
};






const encryptData = (data: string, secretKey: string) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};
  
  const addUser = async () => {
    const tx = new Transaction();
    const packageObjectId = '0xe79573aa07762cf37f2a65c1f7d84fe22095da4d28dcf28d27669ed2c85aae03';
  
    // Generate a unique secret key for this NFT
    const nftSecretKey = generateSecretKey();
  
    // Encrypt the data with the unique secret key
    const encryptedUsername = encryptData(username, nftSecretKey);
    const encryptedEmail = encryptData(email, nftSecretKey);
    const encryptedPhone = encryptData(phone, nftSecretKey);
    const encryptedBio = encryptData(bio, nftSecretKey);
  
    tx.setGasBudget(10000000);
    tx.moveCall({
      target: `${packageObjectId}::userprofile::create_profile`,
      arguments: [
        tx.object('0x0c52efc722c5205501557f54aafb71070a22c1bef43cf24b1cd9616b19fa9986'),
        tx.pure.string(encryptedUsername),
        tx.pure.string(encryptedEmail),
        tx.pure.string(encryptedPhone),
        tx.pure.string(encryptedBio),
      ],
    });
  
    try {
      const response = await signAndExecuteTransactionBlock(
        {
          transaction: tx as any,
        },
        {
          onSuccess: ({ digest, effects }) => {
            client.waitForTransaction({
              digest: digest,
              options: {
                showEffects: true,
                showBalanceChanges: true,
                showEvents: true,
              },
            })
            .then(async (tx) => {
              const objectId = tx.effects?.created?.[0]?.reference?.objectId;
              if (objectId) {
                // Save the secret key to your database here
                await saveSecretKeyToDatabase(objectId, nftSecretKey);
              }
            });
          },
          onError(error) {
            console.log('error', error);
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  // Define a function to save the secret key to your database
  const saveSecretKeyToDatabase = async (nftId: string, secretKey: string) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/nfts/', { nft_id: nftId, secret_key: secretKey });
      console.log('Secret key saved successfully');
    } catch (error) {
      console.error('Error saving secret key:', error);
    }
  };
  
  


const asciiArrayToString = (asciiArray:any) => {
  return String.fromCharCode(...asciiArray);
};


const [buttonText, setButtonText] = useState('Approve');
const [approvedCards, setApprovedCards] = useState([]); // Track approved cards

const handleClick = () => {
  // Change the button text when clicked
  setButtonText('Approved');
};

interface NftCardProps {
  nft: NFT;
}

 interface NFT {
  id: number;
  owner: string;
  // Add other fields as necessary
}

const [approvedNfts, setApprovedNfts] = useState({});

 const handleApproveClick = (index) => {
    // Update the approval status for the specific NFT card
    setApprovedNfts((prevApprovedNfts) => ({
      ...prevApprovedNfts,
      [index]: true, // Mark this NFT as approved
    }));
  };


   return (
    <div className="register-wrapper">
      {activeScreen === 'main' ? (
        <div className="button-container">
          <button onClick={handleAdminClick} className="Admin-button">Admin</button>
          <button onClick={handleUserClick} className="User-button">User</button>
        </div>
      ) : activeScreen === 'admin' ? (
        <div className="admin-dashboard">
          <h2>Admin Dashboard</h2>
          {isButtonVisible && (
                  <button onClick={handleAdminViewNftClick} className="view-nft-button">
                    View All NFT
                  </button>
                )}          

          {/* Display the decoded newContentList */}
          <div className="nft-list">
            {adminNftDetails.length > 0 ? (
              adminNftDetails.map((nft, index) => (
                <div key={index} className="nft-card">
                  <h3>NFT Details</h3>
                  {/* Display additional fields dynamically */}
                  {Object.entries(nft).map(([key, value]) => {
                    if (key !== 'id' && key !== 'owner') {
                      return (
                        <p key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </p>
                      );
                    }
                    return null;
                  })}

                  {/* Approve Button - Change text when approved */}
                  <button className='view-nft-button' onClick={() => handleApproveClick(index)}>
                    {approvedCards.includes(index) ? 'Approved' : 'Approve'}
                  </button>
                </div>

              ))
            ) : (
              <p>No NFTs available</p>
            )}
            <button className='backbutton' onClick={handleBackClick}>Back</button>

          </div>
        </div>
      ) :  (
        <div className="user-dashboard">
          {!showNftForm && !showNftCards ? (
            <>
              <button className="create-nft-button" onClick={handleCreateNftClick}>Create NFT</button>
              <button className="view-nft-button" onClick={handleViewNftClick}>View NFT</button>
            </>
          ) : showNftForm ? (
            <div className="nft-card">
              <div className="dots-menu">⋮</div> {/* 3 Dots at top right */}
              <h2>Create NFT</h2>
              <div>
                <div className="form-field">
                  <label>Name:</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Email ID:</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Phone:</label>
                  <input
                    type="text"
                    placeholder="Enter your phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Bio:</label>
                  <input
                    type="text"
                    placeholder="Enter your bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <button type="submit" onClick={addUser} className="submit-button">
                  Submit
                </button>
              </div>

            
              <button className='backbutton' onClick={handleBackClick}>Back</button>
            </div>

) : (
          
            <div>
            {showNftCards && (
                <div className="nft-card-container">
                    {contentList.map((content, index) => (
                        <div key={index} className="nft-card card">
                            <div className="cardHeader">
                                {/* <h3>Card {index + 1}</h3> */}
                                <div className="kebabMenu" onClick={() => toggleDropdown(index)}>
                                    &#x22EE; {/* 3 vertical dots */}
                                </div>
                            </div>
                            
                            {Object.entries(content).map(([field, value], fieldIndex) => (
                                // Exclude 'id' and 'owner' from being displayed
                                (field !== 'id' && field !== 'owner') && (
                                    <p key={fieldIndex}>
                                        <strong>{field}:</strong> {String(value)}
                                    </p>
                                )
                            ))}
        
                            {/* Dropdown menu */}
                            {dropdownIndex === index && (
                                <div className="dropdownMenu">
                                <div onClick={() => handleShare(content.id)}>Share</div> {/* Pass the content ID */}
                                <div onClick={() => handleEditClick(index)}>Edit</div> {/* Pass id to handleEditClick */}
                                    {/* <div onClick={() => handleOptionClick('Burn', index)}>Burn</div> */}
                                </div>
                            )}
        
                            {/* Edit form */}
                            {editIndex === index && (
                                <form onSubmit={handleEditButtonClick}>
                                    {Object.entries(editFormData).map(([field, value], fieldIndex) => (
                                        <div key={fieldIndex}>
                                            <label>{field}</label>
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => handleInputChange(e, field)}
                                            />
                                        </div>
                                    ))}
                                    <button type="submit">Save Changes</button>
                                    <button onClick={close}>close</button>

                                </form>
                            )}
                        </div>
                    ))}
                </div>
            )}
                    <button className='backbutton' onClick={handleBackClick}>Back</button>

        </div>
        



          )}
        
        </div>
      )}
    </div>
  );
};

export default Register;