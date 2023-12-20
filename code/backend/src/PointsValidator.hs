{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE FlexibleContexts    #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE OverloadedStrings   #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE TypeOperators       #-}

module PointsValidator where

import Cardano.Api (PlutusScript, PlutusScriptV2, writeFileTextEnvelope)
import Cardano.Api.Shelley (PlutusScript (..), ScriptDataJsonSchema (ScriptDataJsonDetailedSchema),
                            fromPlutusData, scriptDataToJson)
import Codec.Serialise
import Data.Aeson as A
import qualified Data.ByteString.Lazy as LBS
import qualified Data.ByteString.Short as SBS
import Data.Functor (void)
import Ledger hiding (singleton)
import qualified Plutus.Script.Utils.V2.Scripts as Scripts
import Plutus.V1.Ledger.Address as V1Address
import qualified Plutus.V1.Ledger.Api as PlutusV1
import qualified PlutusTx
import qualified PlutusTx.Builtins as Builtins
import PlutusTx.Prelude hiding (Semigroup (..), unless, (.))
import Prelude (FilePath, IO, (.))



{-# INLINABLE pointsValidator #-}
pointsValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
pointsValidator datum _ _
    | datum == Builtins.mkI 000000 = ()
    | otherwise = traceError "wrong datum"

validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [|| pointsValidator ||])

valHash :: Ledger.ValidatorHash
valHash = Scripts.validatorHash validator

scrAddress :: V1Address.Address
scrAddress = V1Address.scriptHashAddress valHash

scriptSBS :: SBS.ShortByteString
scriptSBS = SBS.toShort . LBS.toStrict $ serialise validator

serialisedScript :: PlutusScript PlutusScriptV2
serialisedScript = PlutusScriptSerialised scriptSBS

writePointsValidtor :: IO ()
writePointsValidtor = void $ writeFileTextEnvelope "./testnet/pointsValidator.plutus" Nothing serialisedScript

writeJSON :: PlutusTx.ToData a => FilePath -> a -> IO ()
writeJSON file = LBS.writeFile file . A.encode . scriptDataToJson ScriptDataJsonDetailedSchema . fromPlutusData . PlutusV1.toData

writeData :: IO ()
writeData = writeJSON "./testnet/exampleData.json" (123943746 :: Integer)
