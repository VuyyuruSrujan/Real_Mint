import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Types "./Types";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Blob "mo:base/Blob";

actor{

stable var transactionId: Types.TransactionId = 0;
stable var nfts = List.nil<Types.Nft>();
stable var custodians = List.nil<Principal>(); 
type MyMintedNft = Types.MyMintedNft;
// https://forum.dfinity.org/t/is-there-any-address-0-equivalent-at-dfinity-motoko/5445/3
let null_address : Principal = Principal.fromText("aaaaa-aa");


public query func ownerOfDip721(token_id: Types.TokenId) : async Types.OwnerResult {
  let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
  switch (item) {
    case (null) {
      return #Err(#InvalidTokenId);
    };
    case (?token) {
      return #Ok(token.owner);
    };
  };
};

public shared({ caller }) func safeTransferFromDip721(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {  
  if (to == null_address) {
    return #Err(#ZeroAddress);
  } else {
    return transferFrom(from, to, token_id, from);
  };
};

public shared({ caller }) func transferFromDip721(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {
  return transferFrom(from, to, token_id, caller);
};

func transferFrom(from: Principal, to: Principal, token_id: Types.TokenId, caller: Principal) : Types.TxReceipt {
  let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
  switch (item) {
    case null {
      return #Err(#InvalidTokenId);
    };
    case (?token) {
      if (
        caller != token.owner and
        not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })
      ) {
        return #Err(#Unauthorized);
      } else if (Principal.notEqual(from, token.owner)) {
        return #Err(#Other);
      } else {
        nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
          if (item.id == token.id) {
            let update : Types.Nft = {
              owner = to;
              id = item.id;
              metadata = token.metadata;
            };
            return update;
          } else {
            return item;
          }
        });
        transactionId += 1;
        return #Ok(transactionId);
      };
    };
  };
};

public query func getMetadataDip721(token_id: Types.TokenId) : async Types.MetadataResult {
  let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
  switch (item) {
    case null {
      return #Err(#InvalidTokenId);
    };
    case (?token) {
      return #Ok(token.metadata);
    }
  };
};

public func getMetadataForUserDip721(user: Principal) : async Types.ExtendedMetadataResult {
  let item = List.find(nfts, func(token: Types.Nft) : Bool { token.owner == user });
  switch (item) {
    case null {
      return #Err(#Other);
    };
    case (?token) {
      return #Ok({
        metadata_desc = token.metadata;
        token_id = token.id;
      });
    }
  };
};

public query func getTokenIdsForUserDip721(user: Principal) : async [Types.TokenId] {
  let items = List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user });
  let tokenIds = List.map(items, func (item : Types.Nft) : Types.TokenId { item.id });
  return List.toArray(tokenIds);
};

public shared({ caller }) func mintDip721(to: Principal, metadata: Types.MetadataDesc) : async Types.MintReceipt {
  let newId = Nat64.fromNat(List.size(nfts));
  let nft : Types.Nft = {
    owner = to;
    id = newId;
    metadata = metadata;
  };

  nfts := List.push(nft, nfts);

  transactionId += 1;
  
  
  return #Ok({
    token_id = newId;
    id = transactionId;
  });
};

public type MyMintTransdet = {
    tokenid:Nat64;
    owner:Principal;
    custodian:Principal;
    TimeDate:Text;
    transactionid:Nat64;
  };

  var mintedData:[MyMintTransdet]=[];

  public func addMintingTransDet(det: MyMintTransdet): async Text {
    mintedData := Array.append<MyMintTransdet>(mintedData, [det]);
    return "successfully transfered";
    };

    public shared query func getMintTransDetById(custodian: Principal): async [MyMintTransdet] {
      return Array.filter<MyMintTransdet>(mintedData, func x = x.custodian == custodian);
    };
        
    let ledger = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);

    public type Result<Ok, Err> = Result.Result<Ok, Err>;

  public func mint(owner : Principal, amount : Nat) : async Result<(), Text> {
    var balance = Option.get(ledger.get(owner), 0);
    ledger.put(owner, balance + amount);
    return #ok();
    };

    public query func balanceOf(owner : Principal) : async Nat {
        return (Option.get(ledger.get(owner), 0));
    };

    public shared ({ caller }) func transfer(from : Principal, to : Principal, amount : Nat) : async Result<(), Text> {
      let balanceFrom = Option.get(ledger.get(from), 0);
      let balanceTo = Option.get(ledger.get(to), 0);
      if (balanceFrom < amount) {
          return #err("Insufficient balance to transfer");
      };
      ledger.put(from, balanceFrom - amount);
      ledger.put(to, balanceTo + amount);
      return #ok();
    };

    public type ApiError = {
    #Unauthorized;
    #InvalidTokenId;
    #ZeroAddress;
    #Other;
  };


  public type MetadataResultAsset = Result<MetadataDescAsset, ApiError>;

  public type MetadataDescAsset = [MetadataPartasset];

  public type MetadataPartasset = {
    key_val_data_Asset: [MetadataKeyValAsset];
  };
    
    public type MetadataKeyValAsset = {
      AuserName:Text;
      AssetName:Text;
      AssetId:Nat64;
      Image:Blob;
    };

    public type NftAsset = {
    owner: Principal;
    Assetid:Nat64;
    metadata: MetadataDescAsset;
  };

  stable var nftsAsset = List.nil<NftAsset>();

  public shared({ caller }) func mintAsset(myPrin: Principal, metadata: MetadataDescAsset) : async Text {
  let newId = Nat64.fromNat(List.size(nftsAsset));
  let nftdet : NftAsset = {
    owner = myPrin;
    Assetid = newId;
    metadata = metadata;
  };

  nftsAsset := List.push(nftdet, nftsAsset);

  transactionId += 1;
  
  return "successfully minted"
};

};