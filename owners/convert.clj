(require '[clojure.java.shell :refer [sh]]
         '[clojure.string :as string])

;; run this first:
;; npm install -g ethereum-checksum-address

(defn ->checksum [address]
  (-> (sh "ethereum_checksum_address" address)
      :out
      (string/replace "\n" "")))

;; (->checksum "0x60fd35191ffa774e40934efb8ed34b2ec42da320")

(->> (clojure.string/split (slurp "/tmp/owners.txt") #"\n")
     (pmap (fn [s]
            (println s)
            (clojure.string/replace s #"0x[a-fA-F0-9]{40}" ->checksum)))
     (clojure.string/join "\n")
     (spit "/tmp/owners-checksum.txt"))
