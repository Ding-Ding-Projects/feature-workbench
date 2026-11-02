/** Disable PowerShell telemetry before process startup; preserve normal tool environment. */
export function powershellEnvironment(parent=process.env){return {...parent,POWERSHELL_TELEMETRY_OPTOUT:'1'};}
