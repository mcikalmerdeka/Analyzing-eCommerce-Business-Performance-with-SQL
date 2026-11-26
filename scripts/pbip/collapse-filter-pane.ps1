# Ensure the Power BI Desktop Filters pane is collapsed and park the mouse
# away from tooltip targets so screenshots show the full canvas.
# Usage: pwsh -File scripts/pbip/collapse-filter-pane.ps1
param([switch]$Expand)

Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
Add-Type -AssemblyName System.Windows.Forms

$proc = Get-Process PBIDesktop -ErrorAction Stop |
  Where-Object { $_.MainWindowHandle -ne 0 } |
  Select-Object -First 1
if (-not $proc) { throw "Power BI Desktop main window not found." }

$root = [System.Windows.Automation.AutomationElement]::FromHandle($proc.MainWindowHandle)

$target = $null
for ($attempt = 0; $attempt -lt 20 -and -not $target; $attempt++) {
  $all = $root.FindAll(
    [System.Windows.Automation.TreeScope]::Descendants,
    [System.Windows.Automation.Condition]::TrueCondition
  )
  foreach ($el in $all) {
    try {
      if ($el.Current.Name -like 'Collapse or expand the filter pane*') {
        $target = $el
        break
      }
    } catch {}
  }
  if (-not $target) { Start-Sleep -Milliseconds 500 }
}

if (-not $target) {
  Write-Output "No filter-pane toggle found."
  exit 1
}

$pattern = $target.GetCurrentPattern(
  [System.Windows.Automation.ExpandCollapsePattern]::Pattern
)
$state = $pattern.Current.ExpandCollapseState
Write-Output "Current filter pane state: $state"

if ($Expand -and $state -ne 'Expanded') {
  $pattern.Expand()
  Write-Output "Filter pane expanded."
} elseif (-not $Expand -and $state -ne 'Collapsed') {
  $pattern.Collapse()
  Write-Output "Filter pane collapsed."
} else {
  Write-Output "Filter pane already in requested state."
}

# Move the pointer off any toolbar control so hover tooltips do not render.
[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(16, 1032)
Start-Sleep -Milliseconds 700
