'use client'
import { useRef, useEffect} from "react"

export function VlogPlayer( {vdoSrc} : {vdoSrc:string}) {
    const vdoRef = useRef<HTMLVideoElement>(null)

    return (
        <video className="w-full absolute fixed object-cover" src={vdoSrc} ref={vdoRef} autoPlay loop muted/>
    )
}