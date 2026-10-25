import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FullWidthDivider } from "@/components/full-width-divider";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-svh w-full bg-slate-50/70">
			<SidebarProvider className="h-svh w-full">
				<AppSidebar />
				<SidebarInset className="bg-slate-50/70">
					<AppHeader />
					<div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6 lg:p-8">
						<div className="w-full">
							{children}
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
