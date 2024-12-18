import { useEffect, useState } from 'react';
import { useCurrentWallet, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import "./register.css";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { GetOwnedObjectsParams, PaginatedObjectsResponse, SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
// import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';
const secretKey = 'your-secret-key';  // Replace with your own secret key for encryption


// Encrypt a string
interface SuiParsedData {
  dataType: string;
  disassembled?: { [key: string]: unknown; };
  // Add other properties that may exist in SuiParsedData
}


interface NftFields {
  approved: boolean;
  bio: string;        // Change this to string since we're converting ASCII to string
  emailId: string;    // Change to string
  id: { id: string };
  name: string;       // Change to string
  owner: string;
  phone_number: string; // Change to string
}


interface NftData {
  nft_id: string; // or 'number' depending on your API response
  is_share:boolean;
  approved:string;
  secreat_key:string;
  object_id:string;


  
  // Add other fields if needed
}



interface NftCardProps {
  nft: NFT;
}

 interface NFT {
  id: number;
  owner: string;
  // Add other fields as necessary
}




const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMzZmYTZhNi0yY2RkLTRkNjktODU2Ny03ZTFjMjJkNTg4ZDQiLCJlbWFpbCI6InNodWJyYXRoa2dAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjM0M2Q1OTc0MWMwZTY0YmQ2YjE1Iiwic2NvcGVkS2V5U2VjcmV0IjoiNzc5YmI5MzAxNTc1ZTkxOGY3NmZjNmI3YWYyNWI5MWZlNjhmNDRlOWI0OTU4YWJlYzIxOWMzYTUxZjIzZGUyZCIsImlhdCI6MTcyMzk3ODUyMX0.at1zVZONfrfLFz1Cmp9UzHdK6SDeaQU8uRC5-r3Qp4E';
const GATEWAY = "chocolate-selected-asp-545.mypinata.cloud";
const objectId = '0xe6c70f0dfb34cc4017d156d0d194a90456540b8a864b3b0b5e7617518108584c'


const Register = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [buttonText, setButtonText] = useState('Approve');
  const [approvedCards, setApprovedCards] = useState([]); // Track approved cards
  
  
  
  const [activeTab, setActiveTab] = useState('register'); // Tracks the current active tab
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [nftData, setNftData] = useState<NftFields | null>(null); // Use NftFields type
  const [contentList, setContentList] = useState<any[]>([]);
  const [adminNftDetails, setAdminNftDetails] = useState<any[]>([]);

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
  const [approvedNfts, setApprovedNfts] = useState({});





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





  const toggleDropdown = (index: number) => {
      setDropdownIndex(dropdownIndex === index ? null : index); // Toggle dropdown for the clicked card
  };




  const handleOptionClick = (option: string, index: number) => {
    console.log(`Option '${option}' clicked on card ${index + 1}`);
    // Handle different options here (e.g., share, edit, burn)
};




 


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
            console.log(`No data found for NFT ID: ${nftId}`);
            return null; // Return null if no data is found
        }
    } catch (err) {
        console.log(`Error fetching object for NFT ID ${nftId}:`, err);
        return null; // Return null on error
    }
};






function isObjectWithId(value: unknown): value is { id: string | number } {
  return typeof value === 'object' && value !== null && 'id' in value;
}





const handleAdminViewNftClick = async () => {
  try {
    console.log("Fetching shared NFTs...");

    // Step 1: Get all NFTs
    setIsButtonVisible(false);
    const nftResponse = await axios.get<NftData[]>('http://127.0.0.1:8000/api/nfts/');
    console.log("NFT Response:", nftResponse);

    const newContentList: any[] = [];

    // Step 2: Iterate over each NFT and process it
    for (const nft of nftResponse.data) {
      const { object_id, secreat_key, approved, nft_id, is_share } = nft; 
      console.log(is_share,approved,"this is the is_share")

      // Filter out NFTs that are not shared
      if (!is_share) {
        console.log(`Skipping NFT ${{nft_id,approved}} (not shared)`);
        continue;
      }

      if(approved){
        console.log(`Skipping NFT ${{nft_id,approved}} (not shared)`);
        continue;

      }

      console.log("Processing shared NFT with Object ID:", object_id);

      // Prepare options for fetching the object
      const options = {
        showType: true,
        showContent: true,
        showOwner: true,
        showPreviousTransaction: true,
      };
      const params = {
        options: options,
        id: object_id,
      };

      try {
        // Fetch detailed object data using client.getObject
        const response:any = await client.getObject(params);
        console.log("Object Response:", response);

        // Check if the response has valid data
        if (!response?.data?.content?.fields) {
          console.warn("No fields found for Object ID:", object_id);
          continue;
        }

        const decodedContent: any = {};

        // Decode each field in the content
        for (const [key, value] of Object.entries(response.data.content.fields)) {
          console.log("Processing field:", key, "Value:", value);

          // Handle encrypted ASCII arrays
          if (Array.isArray(value) && value.every((v) => typeof v === 'number')) {
            const asciiString = asciiArrayToString(value);
            console.log("Decrypted ASCII string:", asciiString);

            const decryptedValue = decryptData(asciiString, secreat_key);
            console.log("Decrypted value:", decryptedValue);

            decodedContent[key] = decryptedValue;
          } else if (value !== null && value !== undefined) {
            decodedContent[key] = value;
          } else {
            console.warn("Skipping field due to invalid value:", key, value);
          }
        }

        // Add the decoded content to the list
        newContentList.push(decodedContent);
      } catch (error) {
        console.log("Error processing Object ID:", object_id, error);
      }
    }

    console.log("Final Decoded Content List (Shared NFTs):", newContentList);

    // Step 3: Set the decoded content to the state for rendering
    setAdminNftDetails(newContentList);
  } catch (error:any) {
    console.log("Error fetching or processing NFTs:", error);
    setError(error);
  }
};






const handleApproved = async (id: any): Promise<boolean> => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/nfts/${id.id}/`);
    const data = await response.json();
    return data.approved===true;
  } catch (error) {
    console.error("Error fetching approval status:", error);
    return false; // Default to false on error
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




const EditButton = (id: any, updatedData: Record<string, any>) => {


  // console.log(id.id,"this is the id")

  const fetchSecretKey = async (): Promise<string> => {
    // Replace this with your API call to fetch the secret key
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/nfts/${id.id}/`);
      const data = await response.json();
      console.log(data.secreat_key,"this is the screate key")
      return data.secreat_key; // Assuming the response contains the secret key
    } catch (error) {
      console.log("Error fetching secret key:", error);
      throw new Error("Failed to fetch secret key");
    }
  };
 
  const EditUser = async () => {

    const secretKey = await fetchSecretKey();
    


    const tx = new Transaction();
    const packageObjectId = '0xe79573aa07762cf37f2a65c1f7d84fe22095da4d28dcf28d27669ed2c85aae03';


    const encryptedUsername = encryptData(updatedData['name'],secretKey);
    const encryptedEmail    = encryptData(updatedData['emailId'],secretKey);
    const encryptedPhone    = encryptData(updatedData['phone_number'],secretKey);
    const encryptedBio      = encryptData(updatedData['bio'],secretKey);

    console.log(encryptedUsername,updatedData['id'].id)
    tx.setGasBudget(10000000);
    tx.moveCall({
      target: `${packageObjectId}::userprofile::edit_nft`,
      arguments: [
        tx.object('0x0c52efc722c5205501557f54aafb71070a22c1bef43cf24b1cd9616b19fa9986'),
        tx.object(updatedData['id'].id),
        tx.pure.string(encryptedUsername),
        tx.pure.string(encryptedEmail),
        tx.pure.string(encryptedPhone),
        tx.pure.string(encryptedBio),
      
      ],
    });


    // tx.moveCall({
    //   target: `${packageObjectId}::userprofile::create_profile`,
    //   arguments: [
    //     tx.object('0x0c52efc722c5205501557f54aafb71070a22c1bef43cf24b1cd9616b19fa9986'),
        
    //     tx.pure.string(encryptedUsername),
    //     tx.pure.string(encryptedEmail),
    //     tx.pure.string(encryptedPhone),
    //     tx.pure.string(encryptedBio),
    //   ],
    // });

    
      const response = signAndExecuteTransactionBlock(
        {
          transaction: tx as any,
        }
        
     
      );
    
    
     
      alert("NFT EDITED SUCCESSFULLY")
      setActiveTab('viewNFT'); 
   

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





  const handleViewNftClick = async () => {
    setShowNftCards(true);
  
    try {
      // Fetch all NFTs, including object_id and secret_key
      const nftResponse = await axios.get<NftData[]>('http://127.0.0.1:8000/api/nfts/');
      console.log("NFT Response:", nftResponse);
  
      const newContentList: any[] = [];
  
      // Iterate over each NFT row in the response
      for (const nft of nftResponse.data) {
        const { object_id, secreat_key, approved, nft_id } = nft; // Destructure properties
        console.log("Processing NFT with Object ID:", object_id);
  
        // Prepare options for fetching the object
        const options = {
          showType: true,
          showContent: true,
          showOwner: true,
          showPreviousTransaction: true,
        };
        const params = {
          options: options,
          id: object_id,

        };
  
        // Fetch detailed object data using client.getObject
        const response:any = await client.getObject(params);
        console.log("Object Response:", response);
  
        // Check if the response has valid data
        if (!response?.data?.content?.fields) {
          console.warn("No fields found for Object ID:", object_id);
          continue;
        }
  
        const decodedContent: any = {};
  
        // Iterate through each field in the NFT data's content fields
        for (const [key, value] of Object.entries(response.data.content.fields)) {
          console.log("Processing field:", key, "Value:", value);
  
          try {
            // Handle encrypted ASCII arrays
            if (Array.isArray(value) && value.every((v) => typeof v === 'number')) {
              const asciiString = asciiArrayToString(value);
              console.log("Decrypted ASCII string:", asciiString);
  
              const decryptedValue = decryptData(asciiString, secreat_key);
              console.log("Decrypted value:", decryptedValue);
  
              decodedContent[key] = decryptedValue;
            } 
            
            else if (value !== null && value !== undefined) {
              decodedContent[key] = value;
              decodedContent['approved'] = approved;


            }
            
            else {
              console.warn("Skipping field due to invalid value:", key, value);
            }


          } catch (error) {
            console.log("Error processing key:", key, "Value:", value, "Error:", error);
          }
        }
  
        // Add the decoded content to the new content list
        newContentList.push(decodedContent);
      }
  
      console.log("Final Decoded Content List:", newContentList);
  
      // Set the decoded content to be rendered in cards
      setContentList(newContentList);
    } catch (error) {
      console.log("Error fetching or decrypting NFTs:", error);
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
  setDropdownIndex(null)
  console.log(id.id,"this is the id ")
  const secretKey = generateSecretKey(); // Generate a unique key for this NFT
  const encryptedData = encryptData(id.toString(), secretKey); // Encrypt NFT data with the unique key

  const requestBody = {

    is_share:true
    

  };

  try {
    const response = await axios.patch(`http://127.0.0.1:8000/api/myNfts/update-nft/${id.id}/`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Share successful:', response.data);
    alert('Share successful');
  } catch (error: any) {
    if (error?.response) {
      console.log('Error response:', error?.response?.data);
      alert('Error sharing NFT');
    } else {
      console.log('Error sharing NFT:', error);
      alert(`Error sharing NFT: ${error}`);
    }
  }
};



function generateRandom10DigitNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}



const encryptData = (data: string, secretKey: string) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};


  
  const addUser = async () => {
    
    const tx = new Transaction();
    const packageObjectId = '0xe79573aa07762cf37f2a65c1f7d84fe22095da4d28dcf28d27669ed2c85aae03';
  
    // Generate a unique secret key for this NFT
    const nftSecretKey = generateSecretKey();
  
    console.log("generated the id",nftSecretKey)
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
          
                await saveSecretKeyToDatabase(objectId, nftSecretKey);
              }
            });
          },
          onError(error) {
            console.log('error', error);
          },
        }
      );


    } 
    
    
    catch (error) {
      console.log(error);
    }


  };
  
  // Define a function to save the secret key to your database
  const saveSecretKeyToDatabase = async (nftId: string, secretKey: string) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/nfts/', { object_id: nftId, nft_id:generateRandom10DigitNumber(),secreat_key: secretKey, approved:'false',is_share:false});
      console.log('Secret key saved successfully');
      alert("user profile created successful !!!")
      setUsername('')
      setEmail('')
      setPhone('')
      setBio('')

      
      
      
    } catch (error) {
      console.log('Error saving secret key:', error);
    }
  };
  
  


  const asciiArrayToString = (asciiArray:any) => {
    return String.fromCharCode(...asciiArray);
  };









const handleApproveClick = async (index: string) => {
  try {
    console.log(index, "this is the index");

    // Define the API endpoint and payload
    const apiUrl = `http://127.0.0.1:8000/api/myNfts/update-nft/${index}/`; // Assuming `index` corresponds to the NFT's ID
    const payload = { approved: true}; // Updating the `approved` column to `true`

    // Send the PATCH request
    const response = await axios.patch(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response from server:", response.data);

    // Optionally, update the UI or state to reflect the change
    alert("NFT successfully approved!");
  } catch (error) {
    console.log("Error approving NFT:", error);
    alert("Failed to approve the NFT.");
  }
};


return (
  <div className="register-wrapper">
    {activeScreen === 'main' ? (
      <div className="button-container">
        <button onClick={handleAdminClick} className="Admin-button">
          Admin
        </button>
        <button onClick={handleUserClick} className="User-button">
          User
        </button>
      </div>
    ) : activeScreen === 'admin' ? (
      <div className="admin-dashboard">
        <div className="icon-container">
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" onClick={handleBackClick} />
        </div>
        <h2>Admin Dashboard</h2>
        {isButtonVisible && (
          <button onClick={handleAdminViewNftClick} className="view-nft-button">
            View All NFT
          </button>
        )}
        <div className="nft-list">
          {adminNftDetails.length > 0 ? (
            adminNftDetails.map((nft, index) => (
              <div key={index} className="nft-card">
                <h3>NFT Details</h3>
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
                <button
                  className="view-nft-buttons"
                  onClick={() => handleApproveClick(nft.id.id)}
                >
                  Approve
                </button>
              </div>
            ))
          ) : (
            <p></p>
          )}
          {/* <button className="backbutton" onClick={handleBackClick}>
            Back
          </button> */}
        </div>
      </div>
    ) : (
      <div className="user-dashboard">
        <div className="icon-container">
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" onClick={handleBackClick} />
        </div>
        {!showNftForm && !showNftCards ? (
          <>

            <h2>User Dashboard</h2>
            <button className="create-nft-button" onClick={handleCreateNftClick}>
              Create NFT
            </button>
            <button className="view-nft-button" onClick={handleViewNftClick}>
              View NFT
            </button>
          </>
        ) : showNftForm ? (
          <div className="nft-card">
            <div className="dots-menu">⋮</div>
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
            {/* <button className="backbutton" onClick={handleBackClick}>
              Back
            </button> */}
          </div>
        ) : (
          <div>
          {showNftCards && (
            <div className="nft-card-container">
              {contentList.map((content, index) => (
                <div key={index} className="nft-card card">
                  <div className="cardHeader">
                    <div className="kebabMenu" onClick={() => toggleDropdown(index)}>
                      &#x22EE;
                    </div>
                  </div>
                  <div className="approvalStatus">
                    {content.approved ? (
                      <p className="success">✔️ Approved</p>
                    ) : (
                      <p className="error">❌ Not Approved</p>
                    )}
                  </div>
                  {Object.entries(content).map(([field, value], fieldIndex) =>
                    field !== "id" && field !== "owner" && field !== "approved" ? (
                      <p key={fieldIndex}>
                        <strong>{field}:</strong> {String(value)}
                      </p>
                    ) : null
                  )}
                  {dropdownIndex === index && (
                    <div className="dropdownMenu">
                      <div onClick={() => handleShare(content.id)}>Share</div>
                      <div onClick={() => handleEditClick(index)}>Edit</div>
                    </div>
                  )}
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
                      <button type="button" onClick={close}>
                        Close
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    )}
  </div>
);
};

export default Register;